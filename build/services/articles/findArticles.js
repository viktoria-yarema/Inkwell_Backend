import { Article } from '../../models/Article.js';
export const findArticlesByAuthor = async (authorId, { page, limit, status }) => {
    const filter = { authorId, status };
    const total = await Article.countDocuments({ authorId });
    const totalPages = Math.ceil(total / limit);
    const items = await Article.find(filter)
        .sort({ publishedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
    const articles = items.map(item => ({
        id: item._id.toString(),
        title: item.title,
        content: item.content,
        authorId: item.authorId.toString(),
        status: item.status,
        tags: item.tags.map(tag => tag.toString()),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        coverImage: item.coverImage,
        publishedAt: item.publishedAt,
    }));
    return { articles, meta: { total, page, totalPages } };
};
//# sourceMappingURL=findArticles.js.map