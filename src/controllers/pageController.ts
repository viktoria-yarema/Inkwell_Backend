import { NextFunction, Response } from 'express';
import { z } from 'zod';

import User from '../models/User';
import { AuthenticatedRequest } from '../types/auth';
import { AboutSections, HomeSections, PageContentVariants } from '../types/page-content';
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

const validators: Record<PageContentVariants, Record<string, z.ZodSchema>> = {
  [PageContentVariants.HOME]: {
    [HomeSections.HEADER]: headerSchema,
    [HomeSections.FOOTER]: footerSchema,
    [HomeSections.HERO]: heroSchema,
    [HomeSections.LATEST_ARTICLES]: latestArticlesSchema,
    [HomeSections.CATEGORIES]: categoriesSchema,
  },
  [PageContentVariants.ABOUT]: {
    [AboutSections.INTRO]: introSchema,
    [AboutSections.PROFESSIONAL_EXPERIENCE]: professionalExperienceSchema,
    [AboutSections.PHILOSOPHY]: philosophySchema,
    [AboutSections.SKILLS]: skillsSchema,
    [AboutSections.EDUCATIONS]: educationSchema,
  },
  [PageContentVariants.ARTICLES]: {
    default: articlesSchema,
  },
};

const updatePageContentSchema = z
  .object({
    pageVariant: z.nativeEnum(PageContentVariants),
    section: z.string().optional(),
    content: z.unknown(),
  })
  .superRefine((data, ctx) => {
    if (data.pageVariant !== PageContentVariants.ARTICLES && !data.section) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '`section` is required for this pageVariant',
      });
    }
  });

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const updatePageContent = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const parseResult = updatePageContentSchema.safeParse(req.body);
  if (!parseResult.success) {
    const { fieldErrors, formErrors } = parseResult.error.flatten();
    return next(new ApiError(422, JSON.stringify({ fieldErrors, formErrors })));
  }

  const { pageVariant, section, content } = parseResult.data;

  const variantValidators = validators[pageVariant];
  const schema =
    pageVariant === PageContentVariants.ARTICLES
      ? variantValidators.default
      : variantValidators[section as string];

  if (!schema) {
    return next(new ApiError(400, `Unknown section "${section}" for variant "${pageVariant}"`));
  }

  const validation = schema.safeParse(content);

  if (!validation.success) {
    return next(new ApiError(422, JSON.stringify(validation.error.flatten())));
  }

  const path = `pageContent.${pageVariant}${section ? `.${section}` : ''}`;

  try {
    const user = await User.findByIdAndUpdate(
      req.user!.id,
      { $set: { [path]: content } },
      { new: true, runValidators: true }
    )
      .lean()
      .select('-password')
      .exec();

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const { _id, ...rest } = user as any;
    res.json({ id: _id, ...rest });
  } catch (err: any) {
    if (err instanceof ApiError) {
      res.status(err.status).json({ message: err.message });
    } else {
      next(err);
    }
  }
};
