import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

import TokenBlacklist from '../models/TokenBlacklist';
import User from '../models/User';
import { AuthenticatedRequest } from '../types/auth';
import { SERVER_SECRET } from '../utils/env';

const auth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ message: 'No token, authorization denied' });
      return;
    }

    const blacklistedToken = await TokenBlacklist.findOne({ token });

    if (blacklistedToken) {
      res.status(401).json({ message: 'Token is invalid' });
      return;
    }

    let decoded: { id: string };

    try {
      decoded = jwt.verify(token, SERVER_SECRET) as { id: string };
    } catch (jwtError: any) {
      if (jwtError.name === 'TokenExpiredError') {
        res.status(401).json({ message: 'Token has expired' });
        return;
      }
      if (jwtError.name === 'JsonWebTokenError') {
        res.status(401).json({ message: 'Token is malformed or invalid' });
        return;
      }
      if (jwtError.name === 'NotBeforeError') {
        res.status(401).json({ message: 'Token is not active yet' });
        return;
      }
      // Handle any other JWT errors
      res.status(401).json({ message: 'Token verification failed' });
      return;
    }

    req.user = { id: decoded.id };

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Authorization is failed' });
  }
};

export default auth;
