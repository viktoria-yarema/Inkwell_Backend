"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const tagController_1 = require("../controllers/tagController.js");
const auth_1 = __importDefault(require("../middlewares/auth.js"));
const router = express_1.default.Router();
router.get('/', tagController_1.getTags);
router.get('/:id', tagController_1.getTagById);
router.post('/create', [auth_1.default, (0, express_validator_1.check)('title', 'Title is required').not().isEmpty().trim().escape()], tagController_1.createTag);
router.put('/update/:id', [auth_1.default, (0, express_validator_1.check)('title', 'Title is required').not().isEmpty().trim().escape()], tagController_1.updateTag);
router.delete('/delete/:id', auth_1.default, tagController_1.deleteTag);
exports.default = router;
//# sourceMappingURL=tagRoutes.js.map