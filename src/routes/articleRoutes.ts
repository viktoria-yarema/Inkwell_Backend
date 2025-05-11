import express from 'express';
import { check, query } from 'express-validator';

import {
  createArticle,
  deleteArticle,
  getArticleById,
  getArticles,
  getLastArticles,
  updateArticle,
} from '../controllers/articleController';
import auth from '../middlewares/auth';

const router = express.Router();

router.get(
  '/',
  [query('page').isInt({ min: 1 }).optional(), query('limit').isInt({ min: 1 }).optional()],
  getArticles
);

router.get('/last', [query('limit').isInt({ min: 1 }).optional()], getLastArticles);

router.get('/:id', getArticleById);

router.post(
  '/',
  [
    auth,
    check('title', 'Title is required').not().isEmpty().escape(),
    check('content', 'Content is required').not().isEmpty().escape(),
  ],
  createArticle
);

router.put(
  '/:id',
  [
    auth,
    check('title', 'Title is required').not().isEmpty().escape(),
    check('content', 'Content is required').not().isEmpty().escape(),
  ],
  updateArticle
);

router.delete('/:id', auth, deleteArticle);

const articleRoutes = router;

export default articleRoutes;
