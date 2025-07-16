"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.footerSchema = exports.headerSchema = exports.categoriesSchema = exports.aboutSchema = exports.latestArticlesSchema = exports.heroSchema = void 0;
const zod_1 = require("zod");
exports.heroSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    subtitle: zod_1.z.string().min(1, 'Subtitle is required'),
    imageUrl: zod_1.z.string().url('Must be a valid URL').or(zod_1.z.literal('')),
});
exports.latestArticlesSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    subtitle: zod_1.z.string().min(1, 'Subtitle is required'),
});
exports.aboutSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    subtitle: zod_1.z.string().min(1, 'Subtitle is required'),
    imageUrl: zod_1.z.string().url('Must be a valid URL').or(zod_1.z.literal('')),
});
exports.categoriesSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    subtitle: zod_1.z.string().min(1, 'Subtitle is required'),
});
exports.headerSchema = zod_1.z.object({
    brandName: zod_1.z.string().min(1, 'Brand name is required'),
    logoUrl: zod_1.z.string().url('Must be a valid URL').or(zod_1.z.literal('')),
});
exports.footerSchema = zod_1.z.object({
    description: zod_1.z.string().min(1, 'Description is required'),
    copyright: zod_1.z.string().min(1, 'Copyright is required'),
});
//# sourceMappingURL=index.js.map