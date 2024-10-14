import { axiosInstance } from '@/helpers/axiosInstance';
import { devConsoleLog } from '@/helpers/devConsoleLog';
import { Article } from '@/types';

export type CreateArticleDTO = {
  categoryIds: number[];
  title: string;
  language?: string;
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
  const response = await axiosInstance.post('/articles', requestData);
  return response.data;
};

export const updateArticle = async (
  id: number,
  requestData: UpdateArticleDTO,
): Promise<Article> => {
  const response = await axiosInstance.put(`/articles/${id}`, requestData);
  return response.data;
};

export const getArticles = async (
  categoryId?: number,
  page: number = 0,
  size: number = 10,
  tag?: string,
  content?: string,
  username?: string,
): Promise<GetArticlesDTO> => {
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
  return response.data;
};

export const getArticleById = async (id: number): Promise<Article> => {
  const response = await axiosInstance.get(`/articles/${id}`);
  return response.data;
};

export const deleteArticle = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/articles/${id}`);
  devConsoleLog('Article deleted successfully');
};
