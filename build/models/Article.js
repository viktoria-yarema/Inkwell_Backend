"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Article = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    authorId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        required: true,
    },
    tags: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Tag',
        },
    ],
    coverImage: {
        type: String,
        required: true,
    },
    publishedAt: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true,
});
exports.Article = mongoose_1.default.model('Article', ArticleSchema);
//# sourceMappingURL=Article.js.map