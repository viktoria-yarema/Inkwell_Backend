var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { validationResult } from "express-validator";
import Article from "../models/Article";
// Create a new article
export const createArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const article = yield newArticle.save();
        res.json(article);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
// Get all articles
export const getArticles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articles = yield Article.find().populate("authorId", "name").populate("tags", "name");
        res.json(articles);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
// Get a single article by ID
export const getArticleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const article = yield Article.findById(req.params.id).populate("authorId", "name").populate("tags", "name");
        if (!article) {
            res.status(404).json({ message: "Article not found" });
            return;
        }
        res.json(article);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
// Update an article
export const updateArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { title, content, status, tags } = req.body;
    try {
        let article = yield Article.findById(req.params.id);
        if (!article) {
            res.status(404).json({ message: "Article not found" });
            return;
        }
        article.title = title || article.title;
        article.content = content || article.content;
        article.status = status || article.status;
        article.tags = tags || article.tags;
        article = yield article.save();
        res.json(article);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
// Delete an article
export const deleteArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const article = yield Article.findById(req.params.id);
        if (!article) {
            res.status(404).json({ message: "Article not found" });
            return;
        }
        yield article.deleteOne();
        res.status(200).json({ message: "Article removed" });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
