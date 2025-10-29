import { Router } from 'express';
import { register, login, me, logout } from '../controllers/authController';
import { auth } from '../middlewares/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', auth, me);
router.post('/logout', auth, logout);

export default router;
