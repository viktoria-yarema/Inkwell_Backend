import express from 'express';
import { uploadImage } from '../controllers/imageController.js';
import auth from '../middlewares/auth.js';
import { upload } from '../middlewares/uploadMiddleware.js';
// eslint-disable-next-line new-cap
const router = express.Router();
router.use(auth);
router.post('/upload', upload, uploadImage);
export default router;
//# sourceMappingURL=imageRoutes.js.map