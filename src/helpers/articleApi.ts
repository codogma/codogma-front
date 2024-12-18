import { axiosInstance } from '@/helpers/axiosInstance';
import { dispatchCustomEvent } from '@/helpers/dispatchCustomEvent';
// import { getT } from '@/helpers/getT';
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
  // const message = await getT('articleCreated', 'articles');
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
): Promise<Article> => {
  const response = await axiosInstance.put(`/articles/${id}`, requestData);
  dispatchCustomEvent('api', {
    message: 'Article sent to moderation',
    severity: 'info',
  });
  return response.data;
};

export const getArticles = async (
  categoryId?: number,
  page: number = 0,
  size: number = 10,
  tag?: string,
  isBookmarked?: boolean,
  content?: string,
  username?: string,
  isFeed?: boolean,
): Promise<GetArticlesDTO> => {
  const response = await axiosInstance.get('/articles', {
    params: {
      tag,
      content,
      categoryId,
      isBookmarked,
      page,
      size,
      username,
      isFeed,
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
  const response = await axiosInstance.get(`/articles/${id}/draft`);
  dispatchCustomEvent('api', {
    message: 'Article status changed to “Draft”',
    severity: 'warning',
  });
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
  dispatchCustomEvent('api', {
    message: 'Article deleted successfully',
    severity: 'success',
  });
};

export const unbookmark = async (id: number): Promise<Article> => {
  const response = await axiosInstance.delete(`/articles/${id}/unbookmark`);
  dispatchCustomEvent('api', {
    message: 'You have successfully removed the article from your bookmarks',
    severity: 'success',
  });
  return response.data;
};

export const bookmark = async (id: number): Promise<Article> => {
  const response = await axiosInstance.post(`/articles/${id}/bookmark`);
  dispatchCustomEvent('api', {
    message: 'You have successfully added the article to your bookmarks',
    severity: 'success',
  });
  return response.data;
};
