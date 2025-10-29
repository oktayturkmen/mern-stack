import { Router } from 'express';
import { createReview, getReviewsByProduct, getReviewById, updateReview, deleteReview } from '../controllers/reviewController';
import { auth } from '../middlewares/auth';

const router = Router();

// Public routes
router.get('/product/:productId', getReviewsByProduct);
router.get('/:id', getReviewById);

// Protected routes (require authentication)
router.post('/', auth, createReview);
router.put('/:id', auth, updateReview);
router.delete('/:id', auth, deleteReview);

export default router;
