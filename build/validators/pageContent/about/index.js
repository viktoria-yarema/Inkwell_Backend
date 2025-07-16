"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.educationSchema = exports.skillsSchema = exports.philosophySchema = exports.professionalExperienceSchema = exports.professionalExperienceItemSchema = exports.introSchema = void 0;
const zod_1 = require("zod");
exports.introSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    content: zod_1.z.string().min(1, 'Content is required'),
});
exports.professionalExperienceItemSchema = zod_1.z.object({
    jobTitle: zod_1.z.string().min(1, 'Job title is required'),
    companyName: zod_1.z.string().min(1, 'Company name is required'),
    startDate: zod_1.z.date().optional(),
    endDate: zod_1.z.date().optional(),
    description: zod_1.z.string().min(1, 'Description is required'),
});
exports.professionalExperienceSchema = zod_1.z.array(exports.professionalExperienceItemSchema);
exports.philosophySchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    content: zod_1.z.string().min(1, 'Content is required'),
});
exports.skillsSchema = zod_1.z.array(zod_1.z.string()).min(1, 'Skills are required');
exports.educationSchema = zod_1.z.array(zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    schoolName: zod_1.z.string().min(1, 'School name is required'),
    startDate: zod_1.z.date().optional(),
    endDate: zod_1.z.date().optional(),
    location: zod_1.z.string().min(1, 'Location is required'),
}));
//# sourceMappingURL=index.js.map