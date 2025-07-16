"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const imageController_1 = require("../controllers/imageController.js");
const auth_1 = __importDefault(require("../middlewares/auth.js"));
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware.js");
// eslint-disable-next-line new-cap
const router = express_1.default.Router();
router.use(auth_1.default);
router.post('/upload-article', uploadMiddleware_1.upload, imageController_1.uploadArticleImage);
router.post('/upload-page-content', uploadMiddleware_1.upload, imageController_1.uploadPageContentImage);
exports.default = router;
//# sourceMappingURL=imageRoutes.js.map