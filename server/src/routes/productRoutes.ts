import { Router } from 'express';
import { getAllProducts, getProductBySlug, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { auth, admin } from '../middlewares/auth';

const router = Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:slug', getProductBySlug);

// Admin routes
router.post('/', auth, admin, createProduct);
router.put('/:id', auth, admin, updateProduct);
router.delete('/:id', auth, admin, deleteProduct);

export default router;
