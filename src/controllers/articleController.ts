import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import Article from '../models/Article';
import { getAuthorIdFromToken } from '../utils/getAuthorIdFromToken';

export const createArticle = async (req: Request, res: Response): Promise<void> => {
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
    console.error(err.message);
    res.status(500).send({ message: 'Server error', error: err.message });
  }
};

export const getArticles = async (req: Request, res: Response): Promise<void> => {
  const authorId = getAuthorIdFromToken(req);

  try {
    const articles = await Article.find({ authorId }).sort({ updatedAt: -1 }).lean();

    res.json(articles.map(article => ({ id: article._id, ...article })));
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send({ message: 'Server error', error: err.message });
  }
};

export const getArticleById = async (req: Request, res: Response): Promise<void> => {
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
    res.status(500).send({ message: 'Server error', error: err.message });
  }
};

export const updateArticle = async (req: Request, res: Response): Promise<void> => {
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
    console.error(err.message);
    res.status(500).send({ message: 'Server error', error: err.message });
  }
};

export const deleteArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      res.status(404).json({ message: 'Article not found' });
      return;
    }

    await article.deleteOne();
    res.status(200).json({ message: 'Article removed' });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send({ message: 'Server error', error: err.message });
  }
};

type GetLastArticlesQuery = {
  limit?: number;
};

export const getLastArticles = async (
  req: Request<{}, {}, {}, GetLastArticlesQuery>,
  res: Response
): Promise<void> => {
  const limit = req.query.limit ? parseInt(req.query.limit.toString()) : 4;

  try {
    const articles = await Article.find().sort({ publishedAt: -1 }).limit(limit).lean();
    res.json(articles.map(article => ({ id: article._id, ...article })));
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send({ message: 'Server error', error: err.message });
  }
};
