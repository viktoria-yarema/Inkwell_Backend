var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { JWT_EXPIRES_IN, SERVER_SECRET, JWT_REFRESH_EXPIRATION, JWT_REFRESH_SECRET, } from "../utils/env";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User";
const generateToken = (id) => {
    const options = { expiresIn: Number(JWT_EXPIRES_IN) };
    return jwt.sign({ id }, SERVER_SECRET, options);
};
const generateRefreshToken = (id) => {
    const options = { expiresIn: Number(JWT_REFRESH_EXPIRATION) };
    return jwt.sign({ id }, JWT_REFRESH_SECRET, options);
};
export const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { email, password } = req.body;
    try {
        let user = yield User.findOne({ email });
        if (user) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        user = new User({
            email,
            password,
        });
        yield user.save();
        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        res.status(201).json({ token, refreshToken });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error while registration");
    }
});
export const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { email, password } = req.body;
    try {
        const user = yield User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid Credentials" });
            return;
        }
        const isMatch = yield user.matchPassword(password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid Credentials" });
            return;
        }
        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        res.status(201).json({ token, refreshToken });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
export const refreshAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(403).json({ message: "Refresh token required" });
        return;
    }
    try {
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const user = yield User.findById(decoded.id);
        if (!user) {
            res.status(403).json({ message: "Invalid refresh token" });
            return;
        }
        const newAccessToken = generateToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);
        res.json({ token: newAccessToken, refreshToken: newRefreshToken });
    }
    catch (err) {
        res.status(403).json({ message: "Invalid refresh token" });
    }
});
export const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id).select("-password");
        res.json(user);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
