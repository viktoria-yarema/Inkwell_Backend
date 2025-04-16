import express from 'express';

import { deleteImage, getUserImages, uploadImage } from '../controllers/imageController';
import auth from '../middlewares/auth';
import { upload } from '../middlewares/uploadMiddleware';

// eslint-disable-next-line new-cap
const router = express.Router();

// Apply JWT authentication to all image routes
router.use(auth);

// Upload a new image
router.post('/upload', upload, uploadImage);

// Get all images for the authenticated user
router.get('/', getUserImages);

// Delete an image
router.delete('/:id', deleteImage);

export default router;
