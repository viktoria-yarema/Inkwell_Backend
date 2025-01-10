import { validationResult } from "express-validator";
import Article from "../models/Article.js";

// Create a new article
export const createArticle = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
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
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get all articles
export const getArticles = async (req, res) => {
  try {
    const articles = await Article.find().populate("authorId", "name").populate("tags", "name");
    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get a single article by ID
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate("authorId", "name").populate("tags", "name");

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Update an article
export const updateArticle = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, content, status, tags } = req.body;

  try {
    let article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    article.title = title || article.title;
    article.content = content || article.content;
    article.status = status || article.status;
    article.tags = tags || article.tags;

    article = await article.save();
    res.json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Delete an article
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    await article.deleteOne();
    res.json({ message: "Article removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}; 