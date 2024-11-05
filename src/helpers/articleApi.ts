import { axiosInstance } from '@/helpers/axiosInstance';
import { devConsoleInfo } from '@/helpers/devConsoleLogs';
import { Article, Language } from '@/types';

export type CreateDraftArticleDTO = {
  title: string;
  content?: string | null;
};

export type UpdateDraftArticleDTO = {
  language?: Language | null;
  originalArticleId?: number | null;
  title?: string | null;
  previewContent?: string | null;
  content?: string | null;
  categoryIds?: number[] | null;
  tags?: string[] | null;
};

export type UpdateArticleDTO = {
  language: Language;
  originalArticleId?: number | null;
  title: string;
  previewContent: string;
  content: string;
  categoryIds: number[];
  tags: string[];
};

export type GetArticlesDTO = {
  totalElements: number;
  totalPages: number;
  content: Article[];
};

export const createDraftArticle = async (
  requestData: CreateDraftArticleDTO,
): Promise<Article> => {
  const response = await axiosInstance.post('/articles/drafts', requestData);
  return response.data;
};

export const updateDraftArticle = async (
  id: number | undefined,
  requestData: UpdateDraftArticleDTO,
): Promise<void> => {
  await axiosInstance.patch(`/articles/drafts/${id}`, requestData);
};

export const updateArticle = async (
  id: number | undefined,
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

export const getDraftArticles = async (): Promise<Article[]> => {
  const response = await axiosInstance.get('/articles/drafts');
  return response.data;
};

export const getDraftedArticleById = async (
  id: number | undefined,
): Promise<Article> => {
  const response = await axiosInstance.get(`/articles/drafts/${id}`);
  return response.data;
};

export const getArticleById = async (
  id: number | undefined,
): Promise<Article> => {
  const response = await axiosInstance.get(`/articles/${id}`);
  return response.data;
};

export const deleteArticle = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/articles/${id}`);
  devConsoleInfo('Article deleted successfully');
};
