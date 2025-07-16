import express from 'express';
import { check } from 'express-validator';
import { createTag, deleteTag, getTagById, getTags, updateTag } from '../controllers/tagController.js';
import auth from '../middlewares/auth.js';
const router = express.Router();
router.get('/', getTags);
router.get('/:id', getTagById);
router.post('/create', [auth, check('title', 'Title is required').not().isEmpty().trim().escape()], createTag);
router.put('/update/:id', [auth, check('title', 'Title is required').not().isEmpty().trim().escape()], updateTag);
router.delete('/delete/:id', auth, deleteTag);
export default router;
//# sourceMappingURL=tagRoutes.js.map