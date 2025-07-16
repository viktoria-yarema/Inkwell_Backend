import express from 'express';
import { check, query } from 'express-validator';
import { createArticle, deleteArticle, getArticleById, getArticles, updateArticle, } from '../controllers/articleController.js';
import auth from '../middlewares/auth.js';
const router = express.Router();
router.get('/', [auth, query('page').isInt({ min: 1 }).optional(), query('limit').isInt({ min: 1 }).optional()], getArticles);
router.get('/:id', [auth], getArticleById);
router.post('/', [
    auth,
    check('title', 'Title is required').not().isEmpty().escape(),
    check('content', 'Content is required').not().isEmpty().escape(),
], createArticle);
router.put('/:id', [
    auth,
    check('title', 'Title is required').not().isEmpty().escape(),
    check('content', 'Content is required').not().isEmpty().escape(),
], updateArticle);
router.delete('/:id', auth, deleteArticle);
const articleRoutes = router;
export default articleRoutes;
//# sourceMappingURL=articleRoutes.js.map