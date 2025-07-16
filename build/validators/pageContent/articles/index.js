"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.articlesSchema = void 0;
const zod_1 = require("zod");
exports.articlesSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    subtitle: zod_1.z.string().min(1, 'Subtitle is required'),
});
//# sourceMappingURL=index.js.map