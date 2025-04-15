import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import Tag from '../models/Tags';

// Create a new tag
export const createTag = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { title } = req.body;

  try {
    const existingTag = await Tag.findOne({ title: title.toLowerCase() });
    if (existingTag) {
      res.status(400).json({ message: 'Tag already exists' });
      return;
    }

    const newTag = new Tag({
      title: title.toLowerCase(),
    });

    const tag = await newTag.save();
    res.json(tag);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send({ message: 'Server error', error: err.message });
  }
};

// Get all tags
export const getTags = async (_req: Request, res: Response): Promise<void> => {
  try {
    const tags = await Tag.find().sort({ title: 1 }).lean();

    res.json(tags.map(tag => ({ id: tag._id, ...tag })));
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send({ message: 'Server error', error: err.message });
  }
};

export const getTagById = async (req: Request, res: Response): Promise<void> => {
  try {
    const tag = await Tag.findById(req.params.id).lean();

    if (!tag) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }

    res.json({ id: tag._id, ...tag });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send({ message: 'Server error', error: err.message });
  }
};

export const updateTag = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { title } = req.body;

  try {
    // Check if the new title already exists for another tag
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

    tag.title = title.toLowerCase();
    tag = await tag.save();

    res.json({ id: tag._id, ...tag.toObject() });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send({ message: 'Server error', error: err.message });
  }
};

export const deleteTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }

    await tag.deleteOne();
    res.json({ message: 'Tag removed' });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send({ message: 'Server error', error: err.message });
  }
};
