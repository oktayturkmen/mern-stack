import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import { Review } from '../src/models/Review';
import { Product } from '../src/models/Product';
import { User } from '../src/models/User';

describe('Review API', () => {
  let authCookie: string;
  let testProduct: any;
  let testUser: any;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce_test');
  });

  afterAll(async () => {
    // Clean up and disconnect
    await Review.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    // Clean up before each test
    await Review.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});

    // Create test user
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    authCookie = userResponse.headers['set-cookie'][0];
    testUser = userResponse.body.user;

    // Create test product
    const product = new Product({
      title: 'Test Product',
      description: 'Test Description',
      images: ['https://example.com/image.jpg'],
      price: 100,
      stock: 10,
      category: 'Electronics'
    });
    await product.save();
    testProduct = product;
  });

  describe('POST /api/reviews', () => {
    it('should create review with valid data', async () => {
      const reviewData = {
        productId: testProduct._id.toString(),
        rating: 5,
        comment: 'Great product!'
      };

      const response = await request(app)
        .post('/api/reviews')
        .set('Cookie', authCookie)
        .send(reviewData)
        .expect(201);

      expect(response.body.message).toBe('Review created successfully');
      expect(response.body.review.rating).toBe(5);
      expect(response.body.review.comment).toBe('Great product!');
      expect(response.body.review.user.name).toBe('Test User');
    });

    it('should not create review without authentication', async () => {
      const reviewData = {
        productId: testProduct._id.toString(),
        rating: 5,
        comment: 'Great product!'
      };

      const response = await request(app)
        .post('/api/reviews')
        .send(reviewData)
        .expect(401);

      expect(response.body.code).toBe('UNAUTHORIZED');
    });

    it('should not create duplicate review for same product', async () => {
      const reviewData = {
        productId: testProduct._id.toString(),
        rating: 5,
        comment: 'Great product!'
      };

      // First review
      await request(app)
        .post('/api/reviews')
        .set('Cookie', authCookie)
        .send(reviewData)
        .expect(201);

      // Second review for same product
      const response = await request(app)
        .post('/api/reviews')
        .set('Cookie', authCookie)
        .send(reviewData)
        .expect(409);

      expect(response.body.code).toBe('REVIEW_EXISTS');
    });

    it('should validate rating range', async () => {
      const reviewData = {
        productId: testProduct._id.toString(),
        rating: 6, // Invalid rating
        comment: 'Great product!'
      };

      const response = await request(app)
        .post('/api/reviews')
        .set('Cookie', authCookie)
        .send(reviewData)
        .expect(400);

      expect(response.body.message).toContain('rating');
    });

    it('should validate comment length', async () => {
      const reviewData = {
        productId: testProduct._id.toString(),
        rating: 5,
        comment: 'A'.repeat(501) // Too long
      };

      const response = await request(app)
        .post('/api/reviews')
        .set('Cookie', authCookie)
        .send(reviewData)
        .expect(400);

      expect(response.body.message).toContain('comment');
    });
  });

  describe('GET /api/reviews/product/:productId', () => {
    beforeEach(async () => {
      // Create test reviews
      const review1 = new Review({
        user: testUser.id,
        product: testProduct._id,
        rating: 5,
        comment: 'Excellent product!'
      });
      await review1.save();

      const review2 = new Review({
        user: testUser.id,
        product: testProduct._id,
        rating: 4,
        comment: 'Good product!'
      });
      await review2.save();
    });

    it('should get reviews by product', async () => {
      const response = await request(app)
        .get(`/api/reviews/product/${testProduct._id}`)
        .expect(200);

      expect(response.body.reviews).toHaveLength(2);
      expect(response.body.reviews[0].rating).toBe(5);
      expect(response.body.reviews[1].rating).toBe(4);
    });

    it('should return empty array for product with no reviews', async () => {
      const newProduct = new Product({
        title: 'New Product',
        description: 'New Description',
        images: ['https://example.com/image.jpg'],
        price: 200,
        stock: 5,
        category: 'Clothing'
      });
      await newProduct.save();

      const response = await request(app)
        .get(`/api/reviews/product/${newProduct._id}`)
        .expect(200);

      expect(response.body.reviews).toHaveLength(0);
    });
  });

  describe('PUT /api/reviews/:id', () => {
    let testReview: any;

    beforeEach(async () => {
      const review = new Review({
        user: testUser.id,
        product: testProduct._id,
        rating: 3,
        comment: 'Average product'
      });
      await review.save();
      testReview = review;
    });

    it('should update review by owner', async () => {
      const updateData = {
        rating: 5,
        comment: 'Actually, great product!'
      };

      const response = await request(app)
        .put(`/api/reviews/${testReview._id}`)
        .set('Cookie', authCookie)
        .send(updateData)
        .expect(200);

      expect(response.body.message).toBe('Review updated successfully');
      expect(response.body.review.rating).toBe(5);
      expect(response.body.review.comment).toBe('Actually, great product!');
    });

    it('should not update review without authentication', async () => {
      const response = await request(app)
        .put(`/api/reviews/${testReview._id}`)
        .send({ rating: 5 })
        .expect(401);

      expect(response.body.code).toBe('UNAUTHORIZED');
    });

    it('should return 404 for non-existent review', async () => {
      const response = await request(app)
        .put('/api/reviews/507f1f77bcf86cd799439011')
        .set('Cookie', authCookie)
        .send({ rating: 5 })
        .expect(404);

      expect(response.body.code).toBe('REVIEW_NOT_FOUND');
    });
  });

  describe('DELETE /api/reviews/:id', () => {
    let testReview: any;

    beforeEach(async () => {
      const review = new Review({
        user: testUser.id,
        product: testProduct._id,
        rating: 3,
        comment: 'Average product'
      });
      await review.save();
      testReview = review;
    });

    it('should delete review by owner', async () => {
      const response = await request(app)
        .delete(`/api/reviews/${testReview._id}`)
        .set('Cookie', authCookie)
        .expect(200);

      expect(response.body.message).toBe('Review deleted successfully');

      // Verify review is deleted
      const deletedReview = await Review.findById(testReview._id);
      expect(deletedReview).toBeNull();
    });

    it('should not delete review without authentication', async () => {
      const response = await request(app)
        .delete(`/api/reviews/${testReview._id}`)
        .expect(401);

      expect(response.body.code).toBe('UNAUTHORIZED');
    });

    it('should return 404 for non-existent review', async () => {
      const response = await request(app)
        .delete('/api/reviews/507f1f77bcf86cd799439011')
        .set('Cookie', authCookie)
        .expect(404);

      expect(response.body.code).toBe('REVIEW_NOT_FOUND');
    });
  });

  describe('Product Rating Update', () => {
    it('should update product rating when review is created', async () => {
      const reviewData = {
        productId: testProduct._id.toString(),
        rating: 5,
        comment: 'Great product!'
      };

      await request(app)
        .post('/api/reviews')
        .set('Cookie', authCookie)
        .send(reviewData)
        .expect(201);

      // Check if product rating was updated
      const updatedProduct = await Product.findById(testProduct._id);
      expect(updatedProduct.ratingAvg).toBe(5);
      expect(updatedProduct.ratingCount).toBe(1);
    });

    it('should update product rating when review is deleted', async () => {
      const reviewData = {
        productId: testProduct._id.toString(),
        rating: 5,
        comment: 'Great product!'
      };

      const createResponse = await request(app)
        .post('/api/reviews')
        .set('Cookie', authCookie)
        .send(reviewData)
        .expect(201);

      const reviewId = createResponse.body.review._id;

      // Delete the review
      await request(app)
        .delete(`/api/reviews/${reviewId}`)
        .set('Cookie', authCookie)
        .expect(200);

      // Check if product rating was reset
      const updatedProduct = await Product.findById(testProduct._id);
      expect(updatedProduct.ratingAvg).toBe(0);
      expect(updatedProduct.ratingCount).toBe(0);
    });
  });
});
