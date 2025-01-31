"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var express_validator_1 = require("express-validator");
var authController_1 = require("../controllers/authController");
var auth_1 = require("../middlewares/auth");
var router = express_1.default.Router();
router.get("/user", auth_1.default, authController_1.getUser);
router.post("/register-user", [
    (0, express_validator_1.check)("email", "Email is required").not().isEmpty().escape(),
    (0, express_validator_1.check)("password", "Password is required").not().isEmpty().escape(),
], authController_1.registerUser);
router.post("/login", [
    (0, express_validator_1.check)("email", "Email is required").not().isEmpty().escape(),
    (0, express_validator_1.check)("password", "Password is required").not().isEmpty().escape(),
], authController_1.loginUser);
router.post("/refresh-token", auth_1.default, authController_1.refreshAccessToken);
var authRoutes = router;
exports.default = authRoutes;
