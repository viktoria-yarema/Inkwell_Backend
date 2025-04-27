import { Storage } from '@google-cloud/storage';
import { NextFunction, Request, Response } from 'express';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { GOOGLE_APPLICATION_CREDENTIALS, GOOGLE_STORAGE_BUCKET } from '../utils/env';
import { getAuthorIdFromToken } from '../utils/getAuthorIdFromToken';

let storageOptions = {};

if (GOOGLE_APPLICATION_CREDENTIALS) {
  storageOptions = { keyFilename: GOOGLE_APPLICATION_CREDENTIALS };
  console.log('Using Google Cloud credentials from:', GOOGLE_APPLICATION_CREDENTIALS);
}

const storage = new Storage(storageOptions);
const bucketName = GOOGLE_STORAGE_BUCKET.split('/').pop() || 'bucket';
const bucket = storage.bucket(bucketName);

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const dbPath = req.params.path;
    const authorId = getAuthorIdFromToken(req);

    if (!authorId) {
      res.status(401).json({ message: 'Unauthorized: Invalid token' });
      return;
    }

    if (!dbPath) {
      res.status(400).json({ message: 'Cloud path is required' });
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
      });
    });

    blobStream.end(buffer);
  } catch (err: any) {
    console.error('Upload error:', err);
    next(err);
  }
};
