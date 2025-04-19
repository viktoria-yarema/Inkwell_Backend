import { Response } from 'express';
import { validationResult } from 'express-validator';

import User from '../models/User';
import { AuthenticatedRequest } from '../types/auth';

export const getUserById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    const formattedUser = user?.toObject();

    if (!formattedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    formattedUser.id = formattedUser._id;
    res.json(formattedUser);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const updateUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { firstName, lastName, phoneNumber, avatarUrl } = req.body;

  try {
    const updateFields: {
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      avatarUrl?: string;
    } = {};

    if (firstName !== undefined) updateFields.firstName = firstName;
    if (lastName !== undefined) updateFields.lastName = lastName;
    if (phoneNumber !== undefined) updateFields.phoneNumber = phoneNumber;
    if (avatarUrl !== undefined) updateFields.avatarUrl = avatarUrl;

    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const formattedUser = user.toObject();
    formattedUser.id = formattedUser._id;

    res.json(formattedUser);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.user?.id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
