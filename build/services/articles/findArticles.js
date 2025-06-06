import { Article } from '../../models/Article.js';
export const findArticlesByAuthor = async (authorId, { page = 1, limit = 10, status, tag }) => {
    const filter = { authorId };
    if (status) {
        filter.status = status;
    }
    if (tag) {
        const tagsToSearch = Array.isArray(tag) ? tag : [tag];
        filter.tags = { $in: tagsToSearch };
    }
    const [total, items] = await Promise.all([
        Article.countDocuments(filter),
        Article.find(filter)
            .sort({ publishedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(),
    ]);
    const totalPages = Math.ceil(total / limit);
    const articles = items.map(item => ({
        id: item._id.toString(),
        title: item.title,
        content: item.content,
        authorId: item.authorId.toString(),
        status: item.status,
        tags: item.tags.map(t => t.toString()),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        coverImage: item.coverImage,
        publishedAt: item.publishedAt,
    }));
    return {
        articles,
        meta: { total, page, totalPages },
    };
};
//# sourceMappingURL=findArticles.js.map