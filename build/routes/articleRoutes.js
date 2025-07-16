"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const articleController_1 = require("../controllers/articleController.js");
const auth_1 = __importDefault(require("../middlewares/auth.js"));
const router = express_1.default.Router();
router.get('/', [auth_1.default, (0, express_validator_1.query)('page').isInt({ min: 1 }).optional(), (0, express_validator_1.query)('limit').isInt({ min: 1 }).optional()], articleController_1.getArticles);
router.get('/:id', [auth_1.default], articleController_1.getArticleById);
router.post('/', [
    auth_1.default,
    (0, express_validator_1.check)('title', 'Title is required').not().isEmpty().escape(),
    (0, express_validator_1.check)('content', 'Content is required').not().isEmpty().escape(),
], articleController_1.createArticle);
router.put('/:id', [
    auth_1.default,
    (0, express_validator_1.check)('title', 'Title is required').not().isEmpty().escape(),
    (0, express_validator_1.check)('content', 'Content is required').not().isEmpty().escape(),
], articleController_1.updateArticle);
router.delete('/:id', auth_1.default, articleController_1.deleteArticle);
const articleRoutes = router;
exports.default = articleRoutes;
//# sourceMappingURL=articleRoutes.js.map