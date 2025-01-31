"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var express_validator_1 = require("express-validator");
var articleController_1 = require("../controllers/articleController");
var auth_1 = require("../middlewares/auth");
var router = express_1.default.Router();
router.get("/", [
    auth_1.default,
    (0, express_validator_1.query)("page").isInt({ min: 1 }).optional(),
    (0, express_validator_1.query)("limit").isInt({ min: 1 }).optional(),
], articleController_1.getArticles);
router.get("/:id", [
    auth_1.default,
], articleController_1.getArticleById);
router.post("/", [
    auth_1.default,
    (0, express_validator_1.check)("title", "Title is required").not().isEmpty().escape(),
    (0, express_validator_1.check)("content", "Content is required").not().isEmpty().escape(),
], articleController_1.createArticle);
router.put("/:id", [
    auth_1.default,
    (0, express_validator_1.check)("title", "Title is required").not().isEmpty().escape(),
    (0, express_validator_1.check)("content", "Content is required").not().isEmpty().escape(),
], articleController_1.updateArticle);
router.delete("/:id", auth_1.default, articleController_1.deleteArticle);
var articleRoutes = router;
exports.default = articleRoutes;
