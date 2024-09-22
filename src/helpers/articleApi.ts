import { axiosInstance } from '@/helpers/axiosInstance';
import { Article } from '@/types';
import { generateAvatarUrl } from '@/helpers/generateAvatar';

export type CreateArticleDTO = {
  categoryIds: number[];
  title: string;
  previewContent: string;
  content: string;
  tags?: string[];
};

export type UpdateArticleDTO = {
  title: string;
  previewContent: string;
  content: string;
  categoryIds: number[];
  tags?: string[];
};

export type GetArticlesDTO = {
  totalElements: number;
  totalPages: number;
  content: Article[];
};

export const createArticle = async (
  requestData: CreateArticleDTO,
): Promise<Article> => {
  try {
    const response = await axiosInstance.post('/articles', requestData);
    return response.data;
  } catch (error: any) {
    console.error('Error creating article: ' + error.message);
    throw error;
  }
};

export const updateArticle = async (
  id: number,
  requestData: UpdateArticleDTO,
): Promise<Article> => {
  try {
    const response = await axiosInstance.put(`/articles/${id}`, requestData);
    return response.data;
  } catch (error: any) {
    console.error('Error updating article: ' + error.message);
    throw error;
  }
};

export const getArticles = async (
  categoryId?: number,
  page: number = 0,
  size: number = 10,
  tag?: string,
  content?: string,
  username?: string,
): Promise<GetArticlesDTO> => {
  try {
    const response = await axiosInstance.get('/articles', {
      params: {
        tag,
        content,
        categoryId,
        page,
        size,
        username,
      },
    });
    return {
      totalPages: response.data.totalPages,
      totalElements: response.data.totalElements,
      content: await Promise.all(
        response.data.content.map(async (article: Article) => {
          return {
            ...article,
            authorAvatarUrl: article.authorAvatarUrl
              ? `${process.env.NEXT_PUBLIC_BASE_URL}${article.authorAvatarUrl}?t=${new Date().getTime()}`
              : await generateAvatarUrl(article.username, 32),
          };
        }),
      ),
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

export const getArticleById = async (id: number): Promise<Article> => {
  try {
    const response = await axiosInstance.get(`/articles/${id}`);
    const article: Article = response.data;
    return {
      ...article,
      authorAvatarUrl: article.authorAvatarUrl
        ? `${process.env.NEXT_PUBLIC_BASE_URL}${article.authorAvatarUrl}?t=${new Date().getTime()}`
        : await generateAvatarUrl(article.username, 32),
    };
  } catch (error) {
    console.error('Error fetching article:', error);
    throw error;
  }
};

export const deleteArticle = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/articles/${id}`);
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error;
  }
};
