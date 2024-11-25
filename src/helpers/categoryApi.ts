import { axiosInstance } from '@/helpers/axiosInstance';
import { devConsoleInfo } from '@/helpers/devConsoleLogs';
import { dispatchCustomEvent } from '@/helpers/dispatchCustomEvent';
import { getIntl } from '@/helpers/getCookies';
import { Category } from '@/types';

export type CategoryCreate = {
  name: string;
  image?: File;
  description?: string;
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

export const getCategories = async (): Promise<Category[]> => {
  const response = await axiosInstance.get('/categories');
  const lang = await getIntl();
  devConsoleInfo(lang);
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
