import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { Article } from '../models/Article';
import {
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

  const { title, content, authorId, status, tags, coverImage } = req.body;

  try {
    const newArticle = new Article({
      title,
      content,
      authorId,
      status,
      tags,
      publishedAt: new Date(),
      coverImage,
    });

    const article = await newArticle.save();
    res.json(article);
  } catch (err: any) {
    next(err);
  }
};

export const getArticles = async (
  req: Request,
  res: Response<GetArticlesResponse | { message: string }>,
  next: NextFunction
): Promise<void> => {
  try {
    const authorId = getAuthorIdFromToken(req);
    const page = req.query.page ? parseInt(req.query.page.toString()) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit.toString()) : 10;
    const status = req.query.status ? req.query.status.toString() : '';
    const tag = req.query.tag ? req.query.tag.toString() : '';

    if (!authorId) {
      res.status(401).json({ message: 'User is invalid' });
      return;
    }

    const data = await findArticlesByAuthor(authorId, {
      page,
      limit,
      status,
      tag,
    });
    res.json(data);
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

  const { title, content, status, tags, coverImage } = req.body;

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
