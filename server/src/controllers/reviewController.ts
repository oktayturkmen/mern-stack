import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { reviewService, CreateReviewData } from '../services/reviewService';

const createReviewSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().min(1, 'Comment is required').max(500, 'Comment must be at most 500 characters')
});

const updateReviewSchema = z.object({
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5').optional(),
  comment: z.string().min(1, 'Comment is required').max(500, 'Comment must be at most 500 characters').optional()
});

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      const error = new Error('Unauthorized') as any;
      error.status = 401;
      error.code = 'UNAUTHORIZED';
      throw error;
    }

    const data = createReviewSchema.parse(req.body);
    const review = await reviewService.createReview(userId, data);
    
    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    next(error);
  }
};

export const getReviewsByProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const reviews = await reviewService.getReviewsByProduct(productId);
    
    res.status(200).json({ reviews });
  } catch (error) {
    next(error);
  }
};

export const getReviewById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const review = await reviewService.getReviewById(id);
    
    if (!review) {
      const error = new Error('Review not found') as any;
      error.status = 404;
      error.code = 'REVIEW_NOT_FOUND';
      throw error;
    }
    
    res.status(200).json({ review });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;
    
    if (!userId) {
      const error = new Error('Unauthorized') as any;
      error.status = 401;
      error.code = 'UNAUTHORIZED';
      throw error;
    }

    const data = updateReviewSchema.parse(req.body);
    const review = await reviewService.updateReview(id, userId, data);
    
    if (!review) {
      const error = new Error('Review not found or unauthorized') as any;
      error.status = 404;
      error.code = 'REVIEW_NOT_FOUND';
      throw error;
    }
    
    res.status(200).json({
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;
    
    if (!userId) {
      const error = new Error('Unauthorized') as any;
      error.status = 401;
      error.code = 'UNAUTHORIZED';
      throw error;
    }

    const deleted = await reviewService.deleteReview(id, userId);
    
    if (!deleted) {
      const error = new Error('Review not found or unauthorized') as any;
      error.status = 404;
      error.code = 'REVIEW_NOT_FOUND';
      throw error;
    }
    
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};
