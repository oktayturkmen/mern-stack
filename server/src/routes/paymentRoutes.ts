import { Router } from 'express';
import { createPaymentIntent, confirmPayment, refundPayment, getPaymentMethods } from '../controllers/paymentController';
import { auth } from '../middlewares/auth';

const router = Router();

// Public routes
router.get('/methods', getPaymentMethods);

// Protected routes (require authentication)
router.post('/create-intent', auth, createPaymentIntent);
router.post('/confirm', auth, confirmPayment);
router.post('/refund', auth, refundPayment);

export default router;
