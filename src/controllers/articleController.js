"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArticle = exports.updateArticle = exports.getArticleById = exports.getArticles = exports.createArticle = void 0;
var express_validator_1 = require("express-validator");
var Article_1 = require("../models/Article");
// Create a new article
var createArticle = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, title, content, authorId, status, tags, newArticle, article, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({ errors: errors.array() });
                    return [2 /*return*/];
                }
                _a = req.body, title = _a.title, content = _a.content, authorId = _a.authorId, status = _a.status, tags = _a.tags;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                newArticle = new Article_1.default({
                    title: title,
                    content: content,
                    authorId: authorId,
                    status: status,
                    tags: tags,
                });
                return [4 /*yield*/, newArticle.save()];
            case 2:
                article = _b.sent();
                res.json(article);
                return [3 /*break*/, 4];
            case 3:
                err_1 = _b.sent();
                console.error(err_1.message);
                res.status(500).send("Server error");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createArticle = createArticle;
// Get all articles
var getArticles = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var articles, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Article_1.default.find().populate("authorId", "name").populate("tags", "name")];
            case 1:
                articles = _a.sent();
                res.json(articles);
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                console.error(err_2.message);
                res.status(500).send("Server error");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getArticles = getArticles;
// Get a single article by ID
var getArticleById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var article, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Article_1.default.findById(req.params.id).populate("authorId", "name").populate("tags", "name")];
            case 1:
                article = _a.sent();
                if (!article) {
                    res.status(404).json({ message: "Article not found" });
                    return [2 /*return*/];
                }
                res.json(article);
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                console.error(err_3.message);
                res.status(500).send("Server error");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getArticleById = getArticleById;
// Update an article
var updateArticle = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, title, content, status, tags, article, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({ errors: errors.array() });
                    return [2 /*return*/];
                }
                _a = req.body, title = _a.title, content = _a.content, status = _a.status, tags = _a.tags;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, Article_1.default.findById(req.params.id)];
            case 2:
                article = _b.sent();
                if (!article) {
                    res.status(404).json({ message: "Article not found" });
                    return [2 /*return*/];
                }
                article.title = title || article.title;
                article.content = content || article.content;
                article.status = status || article.status;
                article.tags = tags || article.tags;
                return [4 /*yield*/, article.save()];
            case 3:
                article = _b.sent();
                res.json(article);
                return [3 /*break*/, 5];
            case 4:
                err_4 = _b.sent();
                console.error(err_4.message);
                res.status(500).send("Server error");
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateArticle = updateArticle;
// Delete an article
var deleteArticle = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var article, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Article_1.default.findById(req.params.id)];
            case 1:
                article = _a.sent();
                if (!article) {
                    res.status(404).json({ message: "Article not found" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, article.deleteOne()];
            case 2:
                _a.sent();
                res.status(200).json({ message: "Article removed" });
                return [3 /*break*/, 4];
            case 3:
                err_5 = _a.sent();
                console.error(err_5.message);
                res.status(500).send("Server error");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteArticle = deleteArticle;
