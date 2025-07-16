"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePageContent = void 0;
const zod_1 = require("zod");
const User_1 = __importDefault(require("../models/User.js"));
const page_content_1 = require("../types/page-content.js");
const about_1 = require("../validators/pageContent/about/index.js");
const articles_1 = require("../validators/pageContent/articles/index.js");
const home_1 = require("../validators/pageContent/home/index.js");
const validators = {
    [page_content_1.PageContentVariants.HOME]: {
        [page_content_1.HomeSections.HEADER]: home_1.headerSchema,
        [page_content_1.HomeSections.FOOTER]: home_1.footerSchema,
        [page_content_1.HomeSections.HERO]: home_1.heroSchema,
        [page_content_1.HomeSections.LATEST_ARTICLES]: home_1.latestArticlesSchema,
        [page_content_1.HomeSections.CATEGORIES]: home_1.categoriesSchema,
    },
    [page_content_1.PageContentVariants.ABOUT]: {
        [page_content_1.AboutSections.INTRO]: about_1.introSchema,
        [page_content_1.AboutSections.PROFESSIONAL_EXPERIENCE]: about_1.professionalExperienceSchema,
        [page_content_1.AboutSections.PHILOSOPHY]: about_1.philosophySchema,
        [page_content_1.AboutSections.SKILLS]: about_1.skillsSchema,
        [page_content_1.AboutSections.EDUCATIONS]: about_1.educationSchema,
    },
    [page_content_1.PageContentVariants.ARTICLES]: {
        default: articles_1.articlesSchema,
    },
};
const updatePageContentSchema = zod_1.z
    .object({
    pageVariant: zod_1.z.nativeEnum(page_content_1.PageContentVariants),
    section: zod_1.z.string().optional(),
    content: zod_1.z.unknown(),
})
    .superRefine((data, ctx) => {
    if (data.pageVariant !== page_content_1.PageContentVariants.ARTICLES && !data.section) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: '`section` is required for this pageVariant',
        });
    }
});
class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
const updatePageContent = async (req, res, next) => {
    const parseResult = updatePageContentSchema.safeParse(req.body);
    if (!parseResult.success) {
        const { fieldErrors, formErrors } = parseResult.error.flatten();
        return next(new ApiError(422, JSON.stringify({ fieldErrors, formErrors })));
    }
    const { pageVariant, section, content } = parseResult.data;
    const variantValidators = validators[pageVariant];
    const schema = pageVariant === page_content_1.PageContentVariants.ARTICLES
        ? variantValidators.default
        : variantValidators[section];
    if (!schema) {
        return next(new ApiError(400, `Unknown section "${section}" for variant "${pageVariant}"`));
    }
    const validation = schema.safeParse(content);
    if (!validation.success) {
        return next(new ApiError(422, JSON.stringify(validation.error.flatten())));
    }
    const path = `pageContent.${pageVariant}${section ? `.${section}` : ''}`;
    try {
        const user = await User_1.default.findByIdAndUpdate(req.user.id, { $set: { [path]: content } }, { new: true, runValidators: true })
            .lean()
            .select('-password')
            .exec();
        if (!user) {
            throw new ApiError(404, 'User not found');
        }
        const { _id, ...rest } = user;
        res.json({ id: _id, ...rest });
    }
    catch (err) {
        if (err instanceof ApiError) {
            res.status(err.status).json({ message: err.message });
        }
        else {
            next(err);
        }
    }
};
exports.updatePageContent = updatePageContent;
//# sourceMappingURL=pageController.js.map