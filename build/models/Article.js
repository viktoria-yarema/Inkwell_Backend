import mongoose from 'mongoose';
const Schema = mongoose.Schema;
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
        type: mongoose.Schema.Types.ObjectId,
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
            type: mongoose.Schema.Types.ObjectId,
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
export const Article = mongoose.model('Article', ArticleSchema);
//# sourceMappingURL=Article.js.map