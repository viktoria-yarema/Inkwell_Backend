import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ImageSchema = new Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    articleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

type Image = mongoose.Document & {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  authorId: mongoose.Types.ObjectId;
  articleId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const Image = mongoose.model<Image>('Image', ImageSchema);

export default Image;
