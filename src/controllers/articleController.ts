import { validationResult } from "express-validator";
import Article from "../models/Article";
import { Request, Response } from "express";

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
    res.status(500).send("Server error");
  }
};

// Get all articles
export const getArticles = async (req: Request, res: Response): Promise<void> => {
  try {
    const articles = await Article.find().populate("authorId", "name").populate("tags", "name");
    res.json(articles);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get a single article by ID
export const getArticleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const article = await Article.findById(req.params.id).populate("authorId", "name").populate("tags", "name");

    if (!article) {
      res.status(404).json({ message: "Article not found" });
      return;
    }

    res.json(article);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
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
    res.json(article);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
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
    res.status(500).send("Server error");
  }
};