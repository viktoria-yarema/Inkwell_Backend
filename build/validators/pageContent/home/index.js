import { z } from 'zod';
export const heroSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    subtitle: z.string().min(1, 'Subtitle is required'),
    imageUrl: z.string().min(1, 'Image URL/path is required').or(z.literal('')),
});
export const latestArticlesSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    subtitle: z.string().min(1, 'Subtitle is required'),
});
export const aboutSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    subtitle: z.string().min(1, 'Subtitle is required'),
    imageUrl: z.string().min(1, 'Image URL/path is required').or(z.literal('')),
});
export const categoriesSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    subtitle: z.string().min(1, 'Subtitle is required'),
});
export const headerSchema = z.object({
    brandName: z.string().min(1, 'Brand name is required'),
    logoUrl: z.string().min(1, 'Logo URL/path is required').or(z.literal('')),
});
export const footerSchema = z.object({
    description: z.string().min(1, 'Description is required'),
    copyright: z.string().min(1, 'Copyright is required'),
});
//# sourceMappingURL=index.js.map