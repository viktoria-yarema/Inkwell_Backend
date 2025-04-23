import { Request } from 'express';
import jwt from 'jsonwebtoken';

import { SERVER_SECRET } from './env';

export const getAuthorIdFromToken = (req: Request<{}, {}, {}, {}>): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SERVER_SECRET) as { id: string };

    return decoded.id;
  } catch (err) {
    console.error('Token verification failed:', err);
    return null;
  }
};
