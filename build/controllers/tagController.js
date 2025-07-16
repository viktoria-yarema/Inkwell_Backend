"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTag = exports.updateTag = exports.getTagById = exports.getTags = exports.createTag = void 0;
const express_validator_1 = require("express-validator");
const Tags_1 = __importDefault(require("../models/Tags.js"));
const createTag = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { title, icon } = req.body;
    try {
        const existingTag = await Tags_1.default.findOne({ title: title.toLowerCase() });
        if (existingTag) {
            res.status(400).json({ message: 'Tag already exists' });
            return;
        }
        const newTag = new Tags_1.default({
            title: title.toLowerCase(),
            icon,
        });
        const tag = await newTag.save();
        res.json(tag);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send({ message: 'Server error', error: err.message });
    }
};
exports.createTag = createTag;
const getTags = async (_req, res) => {
    try {
        const tags = await Tags_1.default.find().sort({ title: 1 }).lean();
        res.json(tags.map(tag => ({ id: tag._id, ...tag })));
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send({ message: 'Server error', error: err.message });
    }
};
exports.getTags = getTags;
const getTagById = async (req, res) => {
    try {
        const tag = await Tags_1.default.findById(req.params.id).lean();
        if (!tag) {
            res.status(404).json({ message: 'Tag not found' });
            return;
        }
        res.json({ id: tag._id, ...tag });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send({ message: 'Server error', error: err.message });
    }
};
exports.getTagById = getTagById;
const updateTag = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { title, icon } = req.body;
    try {
        const existingTag = await Tags_1.default.findOne({
            title: title.toLowerCase(),
            _id: { $ne: req.params.id },
        });
        if (existingTag) {
            res.status(400).json({ message: 'Tag with this title already exists' });
            return;
        }
        const tag = await Tags_1.default.findById(req.params.id);
        if (!tag) {
            res.status(404).json({ message: 'Tag not found' });
            return;
        }
        if (icon) {
            tag.icon = icon;
        }
        else {
            tag.icon = undefined;
        }
        const updatedTag = await tag.save();
        res.json({ id: updatedTag._id, ...updatedTag.toObject() });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send({ message: 'Server error', error: err.message });
    }
};
exports.updateTag = updateTag;
const deleteTag = async (req, res) => {
    try {
        const tag = await Tags_1.default.findById(req.params.id);
        if (!tag) {
            res.status(404).json({ message: 'Tag not found' });
            return;
        }
        await tag.deleteOne();
        res.json({ message: 'Tag removed' });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send({ message: 'Server error', error: err.message });
    }
};
exports.deleteTag = deleteTag;
//# sourceMappingURL=tagController.js.map