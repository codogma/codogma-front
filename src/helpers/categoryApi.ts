import { axiosInstance } from '@/helpers/axiosInstance';
import { devConsoleInfo } from '@/helpers/devConsoleLogs';
import { dispatchCustomEvent } from '@/helpers/dispatchCustomEvent';
import { GetCategory, GetCategoryToUpdate, Language } from '@/types';

export type CategoryCreate = {
  name: Map<Language, string>;
  image?: File;
  description?: Map<Language, string>;
};

export type CategoryUpdate = {
  name?: Map<Language, string>;
  image?: File;
  description?: Map<Language, string>;
};

export type GetCategoriesDTO = {
  totalElements: number;
  totalPages: number;
  content: GetCategory[];
};

export const createCategory = async (
  requestData: CategoryCreate,
): Promise<void> => {
  await axiosInstance.post('/categories', requestData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  dispatchCustomEvent('api', {
    message: 'Category created successfully',
    severity: 'success',
  });
};

export const getCategoriesByName = async (
  name: string,
): Promise<GetCategory[]> => {
  const response = await axiosInstance.get('/categories/list-by-name', {
    params: {
      name,
    },
  });
  return response.data;
};

export const updateCategory = async (
  id: number,
  requestData: CategoryUpdate,
): Promise<GetCategory> => {
  const response = await axiosInstance.put(`/categories/${id}`, requestData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  dispatchCustomEvent('api', {
    message: 'Category updated successfully',
    severity: 'success',
  });
  return response.data;
};

export const getCategories = async (
  tag?: string,
  info?: string,
  isFavorite?: boolean,
  page: number = 0,
  size: number = 10,
  sort: string = 'createdAt',
  order: string = 'desc',
): Promise<GetCategoriesDTO> => {
  const response = await axiosInstance.get('/categories', {
    params: {
      tag,
      info,
      isFavorite,
      page,
      size,
      sort,
      order,
    },
  });
  return response.data;
};

export const getCategoryById = async (id: number): Promise<GetCategory> => {
  const response = await axiosInstance.get(`/categories/${id}`);
  return response.data;
};

export const getCategoryByIdToUpdate = async (
  id: number,
): Promise<GetCategoryToUpdate> => {
  const response = await axiosInstance.get(`/categories/${id}/to-update`);
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/categories/${id}`);
  devConsoleInfo('Category deleted successfully');
};

export const unfavorite = async (id: number): Promise<GetCategory> => {
  const response = await axiosInstance.delete(`/categories/${id}/unfavorite`);
  dispatchCustomEvent('api', {
    message: 'You have successfully removed the category from your favorites',
    severity: 'success',
  });
  return response.data;
};

export const favorite = async (id: number): Promise<GetCategory> => {
  const response = await axiosInstance.post(
    `/categories/${id}/add-to-favorites`,
  );
  dispatchCustomEvent('api', {
    message: 'You have successfully added the category to your favorites',
    severity: 'success',
  });
  return response.data;
};
