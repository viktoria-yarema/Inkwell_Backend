import express from 'express';

import { uploadArticleImage, uploadPageContentImage } from '../controllers/imageController';
import auth from '../middlewares/auth';
import { upload } from '../middlewares/uploadMiddleware';

// eslint-disable-next-line new-cap
const router = express.Router();

router.use(auth);

router.post('/upload-article', upload, uploadArticleImage);
router.post('/upload-page-content', upload, uploadPageContentImage);

export default router;
