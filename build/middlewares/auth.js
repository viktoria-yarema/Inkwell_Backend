"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const TokenBlacklist_1 = __importDefault(require("../models/TokenBlacklist.js"));
const User_1 = __importDefault(require("../models/User.js"));
const env_1 = require("../utils/env.js");
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({ message: 'No token, authorization denied' });
            return;
        }
        const blacklistedToken = await TokenBlacklist_1.default.findOne({ token });
        if (blacklistedToken) {
            res.status(401).json({ message: 'Token is invalid' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, env_1.SERVER_SECRET);
        req.user = { id: decoded.id };
        const user = await User_1.default.findById(decoded.id).select('-password');
        if (!user) {
            res.status(401).json({ message: 'Token is not valid' });
            return;
        }
        next();
    }
    catch (err) {
        console.error(err);
        res.status(401).json({ message: 'Token is not valid' });
    }
};
exports.default = auth;
//# sourceMappingURL=auth.js.map