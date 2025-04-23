import Article from '../../models/Article';

export type GetArticlesQuery = {
  page: number;
  limit: number;
};

export type GetArticlesResponse = {
  articles: Article[];
  meta: {
    total: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
  };
};

export const findArticlesByAuthor = async (
  authorId: string,
  { page, limit }: GetArticlesQuery
): Promise<GetArticlesResponse> => {
  const filter = { authorId };

  const total = await Article.countDocuments({ authorId });

  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;

  const items = await Article.find(filter)
    .sort({ updatedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return { articles: items, meta: { total, page, totalPages, hasNextPage } };
};
