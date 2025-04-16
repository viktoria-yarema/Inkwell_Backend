import { Storage } from '@google-cloud/storage';
import { Request, Response } from 'express';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

import Image from '../models/Image';
import { GOOGLE_STORAGE_BUCKET } from '../utils/env';
import { getAuthorIdFromToken } from '../utils/getAuthorIdFromToken';

// Setup Google Cloud Storage
const storage = new Storage();

const bucketName = GOOGLE_STORAGE_BUCKET.split('/').pop() || 'inkwell_bucket';
const bucket = storage.bucket(bucketName);

// Upload image to Google Cloud Storage
export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const authorId = getAuthorIdFromToken(req);
    if (!authorId) {
      res.status(401).json({ message: 'Unauthorized: Invalid token' });
      return;
    }

    if (!req.files || !('image' in req.files)) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const file = (req.files as { [fieldname: string]: Express.Multer.File[] }).image[0];
    const { originalname, buffer, mimetype, size } = file;
    const fileExtension = path.extname(originalname);
    const filename = `${uuidv4()}${fileExtension}`;

    // Create a new blob in the bucket
    const blob = bucket.file(filename);
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
      // Make the file public
      await blob.makePublic();

      // Get the public URL
      const publicUrl = `${GOOGLE_STORAGE_BUCKET}${filename}`;

      // Save image metadata to database
      const newImage = new Image({
        filename,
        originalName: originalname,
        mimeType: mimetype,
        size,
        url: publicUrl,
        authorId,
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
    const file = bucket.file(image.filename);
    await file.delete();

    // Delete from database
    await image.deleteOne();

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (err: any) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
