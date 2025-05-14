import { FilterQuery } from 'mongoose';

import { Article, ArticleDoc } from '../../models/Article';

export type GetArticlesQuery = {
  page: number;
  limit: number;
  status?: string;
  tag: string;
};

export type ArticleResponse = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  status: 'draft' | 'published';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  coverImage: string;
  publishedAt: Date;
};

export type GetArticlesResponse = {
  articles: ArticleResponse[];
  meta: {
    total: number;
    page: number;
    totalPages: number;
  };
};

export const findArticlesByAuthor = async (
  authorId: string,
  { page = 1, limit = 10, status, tag }: GetArticlesQuery
): Promise<GetArticlesResponse> => {
  const filter: FilterQuery<ArticleDoc> = { authorId };

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
