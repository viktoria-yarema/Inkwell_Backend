import { validationResult } from "express-validator";
import Article from "../models/Article";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SERVER_SECRET } from "../utils/env";

const getAuthorIdFromToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SERVER_SECRET) as { id: string };

    return decoded.id;
  } catch (err) {
    console.error('Token verification failed:', err);
    return null;
  }
};

// Create a new article
export const createArticle = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { title, content, authorId, status, tags } = req.body;

  try {
    const newArticle = new Article({
      title,
      content,
      authorId,
      status,
      tags,
    });

    const article = await newArticle.save();
    res.json(article);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

// Get all articles
export const getArticles = async (req: Request, res: Response): Promise<void> => {
  const authorId = getAuthorIdFromToken(req);

  try {
    const articles = await Article.find({ authorId }).lean();

    res.json(articles.map(article => ({ id: article._id, ...article })));
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

// Get a single article by ID
export const getArticleById = async (req: Request, res: Response): Promise<void> => {
  const authorId = getAuthorIdFromToken(req);

  try {
    const article = await Article.findById(req.params.id).lean();

    if (!article) {
      res.status(404).json({ message: "Article not found" });
      return;
    }

    if(article?.authorId?.toString() !== authorId) {
      res.status(403).json({ message: "You are not authorized to access this article" });
      return;
    }

    res.json({ id: article._id, ...article });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

// Update an article
export const updateArticle = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { title, content, status, tags } = req.body;

  try {
    let article = await Article.findById(req.params.id);

    if (!article) {
      res.status(404).json({ message: "Article not found" });
      return;
    }

    article.title = title || article.title;
    article.content = content || article.content;
    article.status = status || article.status;
    article.tags = tags || article.tags;

    article = await article.save();
    res.json({ id: article._id, ...article });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

// Delete an article
export const deleteArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      res.status(404).json({ message: "Article not found" });
      return;
    }

    await article.deleteOne();
    res.status(200).json({ message: "Article removed" });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};