"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.refreshAccessToken = exports.loginUser = exports.registerUser = void 0;
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const TokenBlacklist_1 = __importDefault(require("../models/TokenBlacklist.js"));
const User_1 = __importDefault(require("../models/User.js"));
const env_1 = require("../utils/env.js");
const generateToken = (id) => {
    const options = { expiresIn: Number(env_1.JWT_EXPIRES_IN) };
    return jsonwebtoken_1.default.sign({ id }, env_1.SERVER_SECRET, options);
};
const generateRefreshToken = (id) => {
    const options = { expiresIn: Number(env_1.JWT_REFRESH_EXPIRATION) };
    return jsonwebtoken_1.default.sign({ id }, env_1.JWT_REFRESH_SECRET, options);
};
const registerUser = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { email, password } = req.body;
    try {
        let user = await User_1.default.findOne({ email });
        if (user) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        user = new User_1.default({
            email,
            password,
        });
        await user.save();
        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        res.status(201).json({ token, refreshToken });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send({ message: 'Server error while registration', error: err.message });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { email, password } = req.body;
    try {
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'Invalid Credentials' });
            return;
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid Credentials' });
            return;
        }
        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });
        res.status(201).json({ token });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send({ message: 'Server error', error: err.message });
    }
};
exports.loginUser = loginUser;
const refreshAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.status(403).json({ message: 'Refresh token required' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, env_1.JWT_REFRESH_SECRET);
        const user = await User_1.default.findById(decoded.id);
        if (!user) {
            res.status(403).json({ message: 'Invalid refresh token' });
            return;
        }
        const newAccessToken = generateToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });
        res.json({ token: newAccessToken });
    }
    catch (err) {
        res.status(403).json({ message: 'Invalid refresh token' });
    }
};
exports.refreshAccessToken = refreshAccessToken;
const logoutUser = async (req, res) => {
    try {
        const accessToken = req.header('Authorization')?.replace('Bearer ', '');
        const refreshToken = req.cookies.refreshToken;
        if (!accessToken) {
            res.status(400).json({ message: 'Access token is required' });
            return;
        }
        if (!refreshToken) {
            res.status(400).json({ message: 'Refresh token is required' });
            return;
        }
        const decodedAccessToken = jsonwebtoken_1.default.verify(accessToken, env_1.SERVER_SECRET);
        const accessTokenExpiresAt = new Date(decodedAccessToken.exp * 1000);
        await new TokenBlacklist_1.default({ token: accessToken, expiresAt: accessTokenExpiresAt }).save();
        const decodedRefreshToken = jsonwebtoken_1.default.verify(refreshToken, env_1.JWT_REFRESH_SECRET);
        const refreshTokenExpiresAt = new Date(decodedRefreshToken.exp * 1000);
        await new TokenBlacklist_1.default({ token: refreshToken, expiresAt: refreshTokenExpiresAt }).save();
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
exports.logoutUser = logoutUser;
//# sourceMappingURL=authController.js.map