import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import Tag from '../models/Tags';
import { getAuthorIdFromToken } from '../utils/getAuthorIdFromToken';

export const createTag = async (req: Request, res: Response): Promise<void> => {
  const authorId = getAuthorIdFromToken(req);

  if (!authorId) {
    res.status(401).json({ message: 'User is invalid' });
    return;
  }

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
      adminId: authorId,
    });

    const tag = await newTag.save();
    res.json(tag);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send({ message: 'Server error', error: err.message });
  }
};

export const getTags = async (req: Request, res: Response): Promise<void> => {
  try {
    const authorId = getAuthorIdFromToken(req);

    const tags = await Tag.find({ adminId: authorId }).sort({ title: 1 }).lean();

    res.json(tags.map(tag => ({ id: tag._id, ...tag })));
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send({ message: 'Server error', error: err.message });
  }
};

export const getTagById = async (req: Request, res: Response): Promise<void> => {
  try {
    const authorId = getAuthorIdFromToken(req);

    const tag = await Tag.findOne({ _id: req.params.id, adminId: authorId }).lean();

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
  const authorId = getAuthorIdFromToken(req);

  if (!authorId) {
    res.status(401).json({ message: 'User is invalid' });
    return;
  }

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

    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }

    if (tag.adminId.toString() !== authorId) {
      res.status(403).json({ message: 'Not authorized to modify this tag' });
      return;
    }

    tag.title = title.toLowerCase();

    if (icon) {
      tag.icon = icon;
    } else {
      tag.icon = undefined;
    }

    const updatedTag = await tag.save();

    res.json({ id: updatedTag._id, ...updatedTag.toObject() });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send({ message: 'Server error', error: err.message });
  }
};

export const deleteTag = async (req: Request, res: Response): Promise<void> => {
  const authorId = getAuthorIdFromToken(req);

  if (!authorId) {
    res.status(401).json({ message: 'User is invalid' });
    return;
  }

  try {
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }

    // Check if the current user is the admin who created this tag
    if (tag.adminId.toString() !== authorId) {
      res.status(403).json({ message: 'Not authorized to delete this tag' });
      return;
    }

    await tag.deleteOne();
    res.json({ message: 'Tag removed' });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send({ message: 'Server error', error: err.message });
  }
};
