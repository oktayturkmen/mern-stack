import { Router } from 'express';
import { createOrder, getMyOrders, getAllOrders, getOrderById, updateOrderStatus, updatePaymentStatus } from '../controllers/orderController';
import { auth, admin } from '../middlewares/auth';

const router = Router();

// Admin routes (must come before /:id to avoid matching)
router.get('/admin/all', auth, admin, getAllOrders);

// User routes (require authentication)
router.post('/', auth, createOrder);
router.get('/my', auth, getMyOrders);
router.get('/:id', auth, getOrderById);

// Admin update routes (require admin role)
router.put('/:id/status', auth, admin, updateOrderStatus);
router.put('/:id/payment', auth, admin, updatePaymentStatus);

export default router;
