"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const pageController_1 = require("../controllers/pageController.js");
const userController_1 = require("../controllers/userController.js");
const auth_1 = __importDefault(require("../middlewares/auth.js"));
const router = express_1.default.Router();
router.use(auth_1.default);
router.get('/', userController_1.getUserById);
router.put('/page-content', pageController_1.updatePageContent);
router.put('/', [
    (0, express_validator_1.check)('firstName', 'First name is optional').optional().escape(),
    (0, express_validator_1.check)('lastName', 'Last name is optional').optional().escape(),
    (0, express_validator_1.check)('phoneNumber', 'Phone number is optional').optional().escape(),
    (0, express_validator_1.check)('avatarUrl', 'Avatar URL is optional').optional().escape(),
], userController_1.updateUser);
router.delete('/', userController_1.deleteUser);
const userRoutes = router;
exports.default = userRoutes;
//# sourceMappingURL=userRoutes.js.map