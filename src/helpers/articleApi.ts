import { axiosInstance } from '@/helpers/axiosInstance';
import { dispatchCustomEvent } from '@/helpers/dispatchCustomEvent';
import { GetArticle, Language } from '@/types';

export type CreateDraftArticleDTO = {
  title: string;
  content?: string | null;
};

export type UpdateDraftArticleDTO = {
  language?: Language | null;
  originalArticleId?: number | null;
  title?: string | null;
  imageUrl?: string | null;
  previewContent?: string | null;
  content?: string | null;
  categoryIds?: number[] | null;
  compilationIds?: number[] | null;
  tags?: string[];
};

export type UpdateArticleDTO = {
  language: Language;
  originalArticleId?: number | null;
  title: string;
  imageUrl: string;
  previewContent: string;
  content: string;
  categoryIds: number[];
  compilationIds: number[];
  tags: string[];
};

export type GetArticlesDTO = {
  totalElements: number;
  totalPages: number;
  number: number;
  content: GetArticle[];
};

export const createDraftArticle = async (
  requestData: CreateDraftArticleDTO,
): Promise<GetArticle> => {
  const response = await axiosInstance.post('/articles/drafts', requestData);
  dispatchCustomEvent('api', {
    message: 'Article draft created',
    severity: 'info',
  });
  return response.data;
};

export const updateDraftArticle = async (
  id: number | undefined,
  requestData: UpdateDraftArticleDTO,
): Promise<void> => {
  await axiosInstance.patch(`/articles/${id}/draft`, requestData);
  dispatchCustomEvent('api', {
    message: 'Article draft updated successfully',
    severity: 'success',
  });
};

export const updateArticle = async (
  id: number | undefined,
  requestData: UpdateArticleDTO,
): Promise<GetArticle> => {
  const response = await axiosInstance.put(`/articles/${id}`, requestData);
  dispatchCustomEvent('api', {
    message: 'Article sent to moderation',
    severity: 'info',
  });
  return response.data;
};

export const getArticles = async (
  categoryId?: number,
  compilationId?: number,
  page: number = 0,
  size: number = 10,
  tag?: string,
  content?: string,
  username?: string,
  isFeed?: boolean,
): Promise<GetArticlesDTO> => {
  const response = await axiosInstance.get('/articles', {
    params: {
      tag,
      content,
      categoryId,
      compilationId,
      page,
      size,
      username,
      isFeed,
    },
  });
  return response.data;
};

export const getViewed = async (
  page: number = 0,
  size: number = 5,
  tag?: string,
  content?: string,
): Promise<GetArticlesDTO> => {
  const response = await axiosInstance.get('/articles/viewed', {
    params: {
      page,
      size,
      tag,
      content,
    },
  });
  return response.data;
};

export const getDraftArticles = async (): Promise<GetArticle[]> => {
  const response = await axiosInstance.get('/articles/drafts');
  return response.data;
};

export const getDraftedArticleById = async (
  id: number | undefined,
): Promise<GetArticle> => {
  const response = await axiosInstance.get(`/articles/${id}/draft`);
  dispatchCustomEvent('api', {
    message: 'Article status changed to “Draft”',
    severity: 'warning',
  });
  return response.data;
};

export const getArticleById = async (
  id: number | undefined,
): Promise<GetArticle> => {
  const response = await axiosInstance.get(`/articles/${id}`);
  return response.data;
};

export const getRecommendationsArticleById = async (
  id: number | undefined,
): Promise<GetArticle> => {
  const response = await axiosInstance.get(`/articles/${id}/recommendations`);
  return response.data;
};

export const getRecommendationsArticles = async (): Promise<GetArticle[]> => {
  const response = await axiosInstance.get('/articles/recommendations');
  return response.data;
};

export const deleteArticle = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/articles/${id}`);
  dispatchCustomEvent('api', {
    message: 'Article deleted successfully',
    severity: 'success',
  });
};

export const addToCompilations = async (
  id: number,
  compilationIds: number[],
): Promise<void> => {
  await axiosInstance.post(`/articles/${id}/add-to-compilations`, {
    compilationIds,
  });
  dispatchCustomEvent('api', {
    message: 'You have successfully added the article to the compilation',
    severity: 'success',
  });
};

export const like = async (id: number): Promise<GetArticle> => {
  const response = await axiosInstance.post(`/articles/${id}/like`);
  dispatchCustomEvent('api', {
    message: 'Liked article',
    severity: 'success',
  });
  return response.data;
};

export const unlike = async (id: number): Promise<GetArticle> => {
  const response = await axiosInstance.delete(`/articles/${id}/unlike`);
  dispatchCustomEvent('api', {
    message: 'Unliked article',
    severity: 'success',
  });
  return response.data;
};
