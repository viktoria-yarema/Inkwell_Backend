import { validationResult } from 'express-validator';
import { Article } from '../models/Article.js';
import { findArticlesByAuthor, } from '../services/articles/findArticles.js';
import { getAuthorIdFromToken } from '../utils/getAuthorIdFromToken.js';
export const createArticle = async (req, res, next) => {
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
    }
    catch (err) {
        next(err);
    }
};
export const getArticles = async (req, res, next) => {
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
    }
    catch (err) {
        next(err);
    }
};
export const getArticleById = async (req, res, next) => {
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
    }
    catch (err) {
        console.error(err.message);
        next(err);
    }
};
export const updateArticle = async (req, res, next) => {
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
    }
    catch (err) {
        next(err);
    }
};
export const deleteArticle = async (req, res, next) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            res.status(404).json({ message: 'Article not found' });
            return;
        }
        await article.deleteOne();
        res.status(200).json({ message: 'Article removed' });
    }
    catch (err) {
        next(err);
    }
};
//# sourceMappingURL=articleController.js.map