import { Router } from 'express';
import { register, login, me, logout, addAddress, deleteAddress, updateProfile } from '../controllers/authController';
import { auth } from '../middlewares/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', auth, me);
router.put('/profile', auth, updateProfile);
router.post('/logout', auth, logout);
router.post('/addresses', auth, addAddress);
router.delete('/addresses/:id', auth, deleteAddress);

export default router;
