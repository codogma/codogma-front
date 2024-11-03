import { axiosInstance } from '@/helpers/axiosInstance';
import { devConsoleInfo } from '@/helpers/devConsoleLogs';
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
  devConsoleInfo('Category created successfully');
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
  return response.data;
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await axiosInstance.get('/categories');
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
