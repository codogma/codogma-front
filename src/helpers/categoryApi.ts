import { axiosInstance } from '@/helpers/axiosInstance';
import { devConsoleInfo } from '@/helpers/devConsoleLogs';
import { dispatchCustomEvent } from '@/helpers/dispatchCustomEvent';
import { Category } from '@/types';

export type CategoryCreate = {
  name: string;
  image?: File;
  description?: string;
};

export type GetCategoriesDTO = {
  totalElements: number;
  totalPages: number;
  content: Category[];
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
): Promise<Category[]> => {
  const response = await axiosInstance.get('/categories/list-by-name', {
    params: {
      name,
    },
  });
  return response.data;
};

export const updateCategory = async (
  id: number,
  requestData: {
    image?: File;
    name?: string;
    description?: string;
  },
): Promise<Category> => {
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
  sort: string = 'name',
  order: string = 'asc',
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

export const getCategoryById = async (id: number): Promise<Category> => {
  const response = await axiosInstance.get(`/categories/${id}`);
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/categories/${id}`);
  devConsoleInfo('Category deleted successfully');
};

export const unfavorite = async (id: number): Promise<Category> => {
  const response = await axiosInstance.delete(`/categories/${id}/unfavorite`);
  dispatchCustomEvent('api', {
    message: 'You have successfully removed the category from your favorites',
    severity: 'success',
  });
  return response.data;
};

export const favorite = async (id: number): Promise<Category> => {
  const response = await axiosInstance.post(
    `/categories/${id}/add-to-favorites`,
  );
  dispatchCustomEvent('api', {
    message: 'You have successfully added the category to your favorites',
    severity: 'success',
  });
  return response.data;
};
