import { Review, IReview } from '../models/Review';
import { Product } from '../models/Product';

export interface CreateReviewData {
  productId: string;
  rating: number;
  comment: string;
}

export interface ReviewService {
  createReview(userId: string, data: CreateReviewData): Promise<IReview>;
  getReviewsByProduct(productId: string): Promise<IReview[]>;
  getReviewById(reviewId: string): Promise<IReview | null>;
  updateReview(reviewId: string, userId: string, data: Partial<CreateReviewData>): Promise<IReview | null>;
  deleteReview(reviewId: string, userId: string): Promise<boolean>;
  updateProductRating(productId: string): Promise<void>;
}

class ReviewServiceImpl implements ReviewService {
  async createReview(userId: string, data: CreateReviewData): Promise<IReview> {
    // Check if product exists
    const product = await Product.findById(data.productId);
    if (!product) {
      const error = new Error('Product not found') as any;
      error.status = 404;
      error.code = 'PRODUCT_NOT_FOUND';
      throw error;
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ user: userId, product: data.productId });
    if (existingReview) {
      const error = new Error('You have already reviewed this product') as any;
      error.status = 409;
      error.code = 'REVIEW_EXISTS';
      throw error;
    }

    // Create review
    const review = new Review({
      user: userId,
      product: data.productId,
      rating: data.rating,
      comment: data.comment
    });

    await review.save();

    // Update product rating
    await this.updateProductRating(data.productId);

    // Return populated review
    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name email')
      .lean();
    
    return populatedReview as IReview;
  }

  async getReviewsByProduct(productId: string): Promise<IReview[]> {
    return Review.find({ product: productId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .lean();
  }

  async getReviewById(reviewId: string): Promise<IReview | null> {
    return Review.findById(reviewId)
      .populate('user', 'name email')
      .populate('product', 'title')
      .lean();
  }

  async updateReview(reviewId: string, userId: string, data: Partial<CreateReviewData>): Promise<IReview | null> {
    const review = await Review.findOne({ _id: reviewId, user: userId });
    if (!review) {
      return null;
    }

    // Update review
    if (data.rating !== undefined) review.rating = data.rating;
    if (data.comment !== undefined) review.comment = data.comment;

    await review.save();

    // Update product rating if rating changed
    if (data.rating !== undefined) {
      await this.updateProductRating(review.product.toString());
    }

    const updatedReview = await Review.findById(review._id)
      .populate('user', 'name email')
      .lean();
    
    return updatedReview as IReview;
  }

  async deleteReview(reviewId: string, userId: string): Promise<boolean> {
    const review = await Review.findOne({ _id: reviewId, user: userId });
    if (!review) {
      return false;
    }

    const productId = review.product.toString();
    await Review.findByIdAndDelete(reviewId);

    // Update product rating
    await this.updateProductRating(productId);

    return true;
  }

  async updateProductRating(productId: string): Promise<void> {
    const reviews = await Review.find({ product: productId });
    
    if (reviews.length === 0) {
      // No reviews, reset to default
      await Product.findByIdAndUpdate(productId, {
        ratingAvg: 0,
        ratingCount: 0
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      ratingAvg: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      ratingCount: reviews.length
    });
  }
}

export const reviewService = new ReviewServiceImpl();
