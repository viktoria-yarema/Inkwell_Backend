import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import Article from '../models/Article';
import {
  GetArticlesQuery,
  GetArticlesResponse,
  findArticlesByAuthor,
} from '../services/articles/findArticles';
import { getAuthorIdFromToken } from '../utils/getAuthorIdFromToken';

export const createArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { title, content, authorId, status, tags, description, coverImage } = req.body;

  try {
    const newArticle = new Article({
      title,
      content,
      authorId,
      status,
      tags,
      publishedAt: new Date(),
      description,
      coverImage,
    });

    const article = await newArticle.save();
    res.json(article);
  } catch (err: any) {
    next(err);
  }
};

export const getArticles = async (
  req: Request<{}, {}, {}, GetArticlesQuery>,
  res: Response<GetArticlesResponse | { message: string }>,
  next: NextFunction
): Promise<void> => {
  try {
    const authorId = getAuthorIdFromToken(req);
    const page = req.query.page ? parseInt(req.query.page.toString()) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit.toString()) : 10;

    if (!authorId) {
      res.status(401).json({ message: 'User is invalid' });
      return;
    }

    const data = await findArticlesByAuthor(authorId, { page, limit });

    res.json({
      articles: data.articles.map(article => ({ id: article._id, ...article })),
      meta: data.meta,
    });
  } catch (err: any) {
    next(err);
  }
};

export const getArticleById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authorId = getAuthorIdFromToken(req);

  try {
    const article = await Article.findById(req.params.id).lean();

    if (!article) {
      res.status(404).json({ message: 'Article not found' });
      return;
    }

    if (article?.authorId?.toString() !== authorId) {
      res.status(403).json({ message: 'You are not authorized to access this article' });
      return;
    }

    res.json({ id: article._id, ...article });
  } catch (err: any) {
    console.error(err.message);
    next(err);
  }
};

export const updateArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { title, content, status, tags, coverImage, description } = req.body;

  try {
    let article = await Article.findById(req.params.id);

    if (!article) {
      res.status(404).json({ message: 'Article not found' });
      return;
    }

    article.title = title || article.title;
    article.content = content || article.content;
    article.status = status || article.status;
    article.tags = tags || article.tags;
    article.coverImage = coverImage || article.coverImage;
    article.description = description || article.description;
    article.publishedAt = new Date();

    article = await article.save();
    res.json({ id: article._id, ...article });
  } catch (err: any) {
    next(err);
  }
};

export const deleteArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      res.status(404).json({ message: 'Article not found' });
      return;
    }

    await article.deleteOne();
    res.status(200).json({ message: 'Article removed' });
  } catch (err: any) {
    next(err);
  }
};

type GetLastArticlesQuery = {
  limit?: number;
};

export const getLastArticles = async (
  req: Request<{}, {}, {}, GetLastArticlesQuery>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const limit = req.query.limit ? parseInt(req.query.limit.toString()) : 4;

  try {
    const articles = await Article.find().sort({ publishedAt: -1 }).limit(limit).lean();
    res.json(articles.map(article => ({ id: article._id, ...article })));
  } catch (err: any) {
    next(err);
  }
};
