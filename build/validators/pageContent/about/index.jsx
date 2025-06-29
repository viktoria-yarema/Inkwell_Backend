import { z } from "zod";
export const introSchema = z.object({
    title: z.string().min(1, "Title is required"),
    subtitle: z.string().min(1, "Subtitle is required"),
    imageUrl: z.string().url("Must be a valid URL").or(z.literal("")),
});
export const professionalExperienceItemSchema = z.object({
    jobTitle: z.string().min(1, "Job title is required"),
    companyName: z.string().min(1, "Company name is required"),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    description: z.string().min(1, "Description is required"),
});
export const professionalExperienceSchema = z.array(professionalExperienceItemSchema);
export const philosophySchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
});
export const skillsSchema = z.array(z.string()).min(1, "Skills are required");
export const educationSchema = z.array(z.object({
    title: z.string().min(1, "Title is required"),
    schoolName: z.string().min(1, "School name is required"),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    location: z.string().min(1, "Location is required"),
}));
//# sourceMappingURL=index.jsx.map