import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import TokenBlacklist from '../models/TokenBlacklist.js';
import User from '../models/User.js';
import { JWT_EXPIRES_IN, JWT_REFRESH_EXPIRATION, JWT_REFRESH_SECRET, SERVER_SECRET, } from '../utils/env.js';
const generateToken = (id) => {
    const options = { expiresIn: Number(JWT_EXPIRES_IN) };
    return jwt.sign({ id }, SERVER_SECRET, options);
};
const generateRefreshToken = (id) => {
    const options = { expiresIn: Number(JWT_REFRESH_EXPIRATION) };
    return jwt.sign({ id }, JWT_REFRESH_SECRET, options);
};
export const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        user = new User({
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
export const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
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
export const refreshAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.status(403).json({ message: 'Refresh token required' });
        return;
    }
    try {
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);
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
export const logoutUser = async (req, res) => {
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
        const decodedAccessToken = jwt.verify(accessToken, SERVER_SECRET);
        const accessTokenExpiresAt = new Date(decodedAccessToken.exp * 1000);
        await new TokenBlacklist({ token: accessToken, expiresAt: accessTokenExpiresAt }).save();
        const decodedRefreshToken = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const refreshTokenExpiresAt = new Date(decodedRefreshToken.exp * 1000);
        await new TokenBlacklist({ token: refreshToken, expiresAt: refreshTokenExpiresAt }).save();
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
//# sourceMappingURL=authController.js.map