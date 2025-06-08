import { NextFunction, Request, Response } from 'express';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { bucket } from '../configs/storage';
import { StaticPageContentVariants } from '../types/page-content';
import { getAuthorIdFromToken } from '../utils/getAuthorIdFromToken';

export const uploadArticleImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authorId = getAuthorIdFromToken(req);

    if (!authorId) {
      res.status(401).json({ message: 'Unauthorized: Invalid token' });
      return;
    }

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const file = req.files[0];
    const { originalname, buffer, mimetype } = file;
    const fileExtension = path.extname(originalname);
    const filename = `${uuidv4()}${fileExtension}`;

    const filePath = `${authorId}/articles/${filename}`;

    const blob = bucket.file(filePath);
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: mimetype,
      },
    });

    blobStream.on('error', err => {
      console.error('Upload error:', err);
      next(err);
    });

    blobStream.on('finish', async () => {
      res.status(200).json({
        message: 'Upload successful',
        imageId: filename,
      });
    });

    blobStream.end(buffer);
  } catch (err: any) {
    console.error('Upload error:', err);
    next(err);
  }
};

type UploadPageContentImageRequest = Request<
  {},
  {},
  {},
  { pageVariant: StaticPageContentVariants; section: string }
>;

export const uploadPageContentImage = async (
  req: UploadPageContentImageRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authorId = getAuthorIdFromToken(req);

    if (!authorId) {
      res.status(401).json({ message: 'Unauthorized: Invalid token' });
      return;
    }

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const { pageVariant, section } = req.body as {
      pageVariant: StaticPageContentVariants;
      section: string;
    };

    const file = req.files[0];
    const { originalname, buffer, mimetype } = file;
    const fileExtension = path.extname(originalname);
    const filename = `${uuidv4()}${fileExtension}`;

    const filePath = `${authorId}/page-content/${pageVariant}/${section}/${filename}`;

    const blob = bucket.file(filePath);
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: mimetype,
      },
    });

    blobStream.on('error', err => {
      console.error('Upload error:', err);
      next(err);
    });

    blobStream.on('finish', async () => {
      res.status(200).json({
        message: 'Upload successful',
        imageId: filename,
      });
    });

    blobStream.end(buffer);
  } catch (err: any) {
    console.error('Upload error:', err);
    next(err);
  }
};
