import bcrypt from 'bcrypt';
import mongoose, { Document, Schema } from 'mongoose';

import { SALT } from '../utils/env';

type User = Document & {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  avatarUrl: string;
  role: string;
  pageContent: any;
  matchPassword(candidatePassword: string): Promise<boolean>;
};

const ExperienceCardSchema = new Schema(
  {
    jobTitle: { type: String, required: true },
    companyName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const EducationCardSchema = new Schema(
  {
    title: { type: String, required: true },
    schoolName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: { type: String, required: true },
  },
  { _id: false }
);

const HomePageContentSchema = new Schema(
  {
    header: {
      brandName: { type: String, required: true },
      logoUrl: { type: String, required: true },
    },
    footer: {
      description: { type: String, required: true },
      copyright: { type: String, required: true },
    },
    hero: {
      title: { type: String, required: true },
      subtitle: { type: String, required: true },
      imageUrl: { type: String, required: true },
    },
    latestArticles: {
      title: { type: String, required: true },
      subtitle: { type: String, required: true },
    },
    about: {
      title: { type: String, required: true },
      subtitle: { type: String, required: true },
      imageUrl: { type: String, required: true },
    },
    categories: {
      title: { type: String, required: true },
      subtitle: { type: String, required: true },
    },
  },
  { _id: false }
);

const AboutPageContentSchema = new Schema(
  {
    intro: {
      title: { type: String, required: true },
      content: { type: String, required: true },
    },
    professionalExperience: [ExperienceCardSchema],
    philosophy: {
      title: { type: String, required: true },
      content: { type: String, required: true },
    },
    skills: [{ type: String }],
    educations: [EducationCardSchema],
  },
  { _id: false }
);

const ArticlesPageContentSchema = new Schema(
  {
    title: { type: String, required: true },
  },
  { _id: false }
);

const PageContentSchema = new Schema(
  {
    home: HomePageContentSchema,
    about: AboutPageContentSchema,
    articles: ArticlesPageContentSchema,
  },
  { _id: false }
);

const UserSchema: Schema<User> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    avatarUrl: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: false,
      default: 'user',
    },
    pageContent: {
      type: PageContentSchema,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(Number(SALT));
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<User>('User', UserSchema);

export default User;
