"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const authController_1 = require("../controllers/authController.js");
const auth_1 = __importDefault(require("../middlewares/auth.js"));
const router = express_1.default.Router();
router.post('/register-user', [
    (0, express_validator_1.check)('email', 'Email is required').not().isEmpty().escape(),
    (0, express_validator_1.check)('password', 'Password is required').not().isEmpty().escape(),
], authController_1.registerUser);
router.post('/login', [
    (0, express_validator_1.check)('email', 'Email is required').not().isEmpty().escape(),
    (0, express_validator_1.check)('password', 'Password is required').not().isEmpty().escape(),
], authController_1.loginUser);
router.post('/refresh-token', authController_1.refreshAccessToken);
router.post('/logout', auth_1.default, authController_1.logoutUser);
const authRoutes = router;
exports.default = authRoutes;
//# sourceMappingURL=authRoutes.js.map