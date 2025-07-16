"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = void 0;
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User.js"));
const getUserById = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user?.id).select('-password');
        const formattedUser = user?.toObject();
        if (!formattedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        formattedUser.id = formattedUser._id;
        res.json(formattedUser);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
exports.getUserById = getUserById;
const updateUser = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { firstName, lastName, phoneNumber, avatarUrl, email, pageContent } = req.body;
    try {
        const updateFields = {};
        if (firstName !== undefined)
            updateFields.firstName = firstName;
        if (lastName !== undefined)
            updateFields.lastName = lastName;
        if (phoneNumber !== undefined)
            updateFields.phoneNumber = phoneNumber;
        if (avatarUrl !== undefined)
            updateFields.avatarUrl = avatarUrl;
        if (email !== undefined)
            updateFields.email = email;
        if (pageContent !== undefined)
            updateFields.pageContent = pageContent;
        const user = await User_1.default.findByIdAndUpdate(req.user?.id, { $set: updateFields }, { new: true }).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const formattedUser = user.toObject();
        formattedUser.id = formattedUser._id;
        res.json(formattedUser);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const user = await User_1.default.findByIdAndDelete(req.user?.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json({ message: 'User deleted successfully' });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=userController.js.map