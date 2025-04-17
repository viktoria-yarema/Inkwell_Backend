import express from 'express';

import { uploadImage } from '../controllers/imageController';
import auth from '../middlewares/auth';
import { upload } from '../middlewares/uploadMiddleware';

// eslint-disable-next-line new-cap
const router = express.Router();

router.use(auth);

router.post('/upload', upload, uploadImage);

export default router;
