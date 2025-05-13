import { validationResult } from 'express-validator';
import Tag from '../models/Tags.js';
export const createTag = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { title, icon } = req.body;
    try {
        const existingTag = await Tag.findOne({ title: title.toLowerCase() });
        if (existingTag) {
            res.status(400).json({ message: 'Tag already exists' });
            return;
        }
        const newTag = new Tag({
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
export const getTags = async (_req, res) => {
    try {
        const tags = await Tag.find().sort({ title: 1 }).lean();
        res.json(tags.map(tag => ({ id: tag._id, ...tag })));
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send({ message: 'Server error', error: err.message });
    }
};
export const getTagById = async (req, res) => {
    try {
        const tag = await Tag.findById(req.params.id).lean();
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
export const updateTag = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { title, icon } = req.body;
    try {
        const existingTag = await Tag.findOne({
            title: title.toLowerCase(),
            _id: { $ne: req.params.id },
        });
        if (existingTag) {
            res.status(400).json({ message: 'Tag with this title already exists' });
            return;
        }
        let tag = await Tag.findById(req.params.id);
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
export const deleteTag = async (req, res) => {
    try {
        const tag = await Tag.findById(req.params.id);
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
//# sourceMappingURL=tagController.js.map