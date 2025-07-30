import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export enum InkwellIcon {
  BookOpen = 'BookOpen',
  Pencil = 'Pencil',
  PaintBrush = 'PaintBrush',
  Palette = 'Palette',
  Users = 'Users',
  Smile = 'Smile',
  Apple = 'Apple',
  Calendar = 'Calendar',
  Camera = 'Camera',
  Video = 'Video',
  MessageCircle = 'MessageCircle',
  Image = 'Image',
  List = 'List',
  CheckCircle = 'CheckCircle',
  Heart = 'Heart',
  Star = 'Star',
  Globe = 'Globe',
  Clipboard = 'Clipboard',
  Bell = 'Bell',
  FileText = 'FileText',
}

const TagSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    icon: {
      type: String,
      enum: Object.values(InkwellIcon),
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Tag = mongoose.model('Tag', TagSchema);

export default Tag;
