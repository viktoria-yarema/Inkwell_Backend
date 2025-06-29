import { z } from 'zod';

import {
  educationSchema,
  introSchema,
  philosophySchema,
  professionalExperienceSchema,
  skillsSchema,
} from '../validators/pageContent/about';
import { articlesSchema } from '../validators/pageContent/articles';
import {
  categoriesSchema,
  footerSchema,
  headerSchema,
  heroSchema,
  latestArticlesSchema,
} from '../validators/pageContent/home';

export enum StaticPageContentVariants {
  HOME = 'home',
  ABOUT = 'about',
  ARTICLES = 'articles',
}

export enum PageContentVariants {
  HOME = 'home',
  ABOUT = 'about',
  ARTICLES = 'articles',
}

export enum HomeSections {
  HEADER = 'header',
  FOOTER = 'footer',
  HERO = 'hero',
  LATEST_ARTICLES = 'latestArticles',
  CATEGORIES = 'categories',
}
export enum AboutSections {
  INTRO = 'intro',
  PROFESSIONAL_EXPERIENCE = 'professionalExperience',
  PHILOSOPHY = 'philosophy',
  SKILLS = 'skills',
  EDUCATIONS = 'educations',
}

export type HomePageContent = {
  [HomeSections.HEADER]: z.infer<typeof headerSchema>;
  [HomeSections.FOOTER]: z.infer<typeof footerSchema>;
  [HomeSections.HERO]: z.infer<typeof heroSchema>;
  [HomeSections.LATEST_ARTICLES]: z.infer<typeof latestArticlesSchema>;
  [HomeSections.CATEGORIES]: z.infer<typeof categoriesSchema>;
};

export type ExperienceCard = {
  jobTitle: string;
  companyName: string;
  startDate: Date;
  endDate: Date;
  description: string;
};

export type EducationCard = {
  title: string;
  schoolName: string;
  startDate: Date;
  endDate: Date;
  location: string;
};

export type AboutPageContent = {
  [AboutSections.INTRO]: z.infer<typeof introSchema>;
  [AboutSections.PROFESSIONAL_EXPERIENCE]: z.infer<typeof professionalExperienceSchema>;
  [AboutSections.PHILOSOPHY]: z.infer<typeof philosophySchema>;
  [AboutSections.SKILLS]: z.infer<typeof skillsSchema>;
  [AboutSections.EDUCATIONS]: z.infer<typeof educationSchema>;
};

export type ArticlesPageContent = z.infer<typeof articlesSchema>;

export type PageContent = {
  [PageContentVariants.HOME]: HomePageContent;
  [PageContentVariants.ARTICLES]: ArticlesPageContent;
  [PageContentVariants.ABOUT]: AboutPageContent;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  avatarUrl?: string;
  pageContent: PageContent;
};

export type UpdateUser = Partial<
  Pick<User, 'firstName' | 'lastName' | 'phoneNumber' | 'email' | 'pageContent'>
>;

export type UploadPageContentImageRequest = {
  file: File;
  pageVariant: PageContentVariants;
  section: string;
};
