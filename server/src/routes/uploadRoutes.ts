import { Router } from 'express';
import multer from 'multer';
import { auth, admin } from '../middlewares/auth';
import { uploadImages } from '../controllers/uploadController';

const router = Router();

// Use memory storage; we send buffers to Cloudinary
const upload = multer({ storage: multer.memoryStorage() });

// Admin-only image upload
router.post('/images', auth, admin, upload.array('files', 10), uploadImages);

export default router;


