import express from 'express';
import { uploadArticleImage, uploadPageContentImage } from '../controllers/imageController.js';
import auth from '../middlewares/auth.js';
import { upload } from '../middlewares/uploadMiddleware.js';
// eslint-disable-next-line new-cap
const router = express.Router();
router.use(auth);
router.post('/upload-article', upload, uploadArticleImage);
router.post('/upload-page-content', upload, uploadPageContentImage);
export default router;
//# sourceMappingURL=imageRoutes.js.map