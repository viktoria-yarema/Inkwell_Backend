import { Storage } from '@google-cloud/storage';
import { Request, Response } from 'express';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

import Image from '../models/Image';
import { GOOGLE_APPLICATION_CREDENTIALS, GOOGLE_STORAGE_BUCKET } from '../utils/env';
import { getAuthorIdFromToken } from '../utils/getAuthorIdFromToken';

// Setup Google Cloud Storage
let storageOptions = {};


if (GOOGLE_APPLICATION_CREDENTIALS) {
  try {
    const credentials = JSON.parse(GOOGLE_APPLICATION_CREDENTIALS);
    storageOptions = { credentials };
    console.log('Using explicit Google Cloud credentials');
  } catch (error) {
    console.error('Error parsing Google Cloud credentials:', error);
  }
}

const storage = new Storage(storageOptions);
const bucketName = GOOGLE_STORAGE_BUCKET.split('/').pop() || 'bucket';
const bucket = storage.bucket(bucketName);

// Upload image to Google Cloud Storage
export const uploadImage = async (req: Request, res: Response): Promise<void> => {
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

    // Get the first file, regardless of field name
    const file = req.files[0];
    const { originalname, buffer, mimetype, size } = file;
    const fileExtension = path.extname(originalname);
    const filename = `${uuidv4()}${fileExtension}`;

    // Create path with folders for authorId and articles
    const filePath = `${authorId}/articles/${filename}`;

    // Create a new blob in the bucket
    const blob = bucket.file(filePath);
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: mimetype,
      },
    });

    blobStream.on('error', err => {
      console.error('Upload error:', err);
      res.status(500).json({ message: 'Upload failed', error: err.message });
    });

    blobStream.on('finish', async () => {
      // Get the public URL
      const publicUrl = `${GOOGLE_STORAGE_BUCKET}/${authorId}/articles/${filename}`;

      // Save image metadata to database
      const newImage = new Image({
        filename,
        originalName: originalname,
        mimeType: mimetype,
        size,
        url: publicUrl,
        authorId,
        filePath,
        articleId: req.body.articleId || undefined,
      });

      const savedImage = await newImage.save();

      res.status(200).json({
        message: 'Upload successful',
        image: savedImage,
      });
    });

    blobStream.end(buffer);
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all images for a user
export const getUserImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const authorId = getAuthorIdFromToken(req);
    if (!authorId) {
      res.status(401).json({ message: 'Unauthorized: Invalid token' });
      return;
    }

    const images = await Image.find({ authorId }).sort({ createdAt: -1 });
    res.status(200).json(images);
  } catch (err: any) {
    console.error('Error fetching images:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete an image
export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const authorId = getAuthorIdFromToken(req);
    if (!authorId) {
      res.status(401).json({ message: 'Unauthorized: Invalid token' });
      return;
    }

    const imageId = req.params.id;
    const image = await Image.findById(imageId);

    if (!image) {
      res.status(404).json({ message: 'Image not found' });
      return;
    }

    // Check if the user owns the image
    if (image.authorId.toString() !== authorId) {
      res.status(403).json({ message: 'Not authorized to delete this image' });
      return;
    }

    // Delete from Google Cloud Storage
    const filePath = `${authorId}/articles/${image.filename}`;
    const file = bucket.file(filePath);
    await file.delete();

    // Delete from database
    await image.deleteOne();

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (err: any) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
