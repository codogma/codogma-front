import { axiosInstance } from '@/helpers/axiosInstance';
import { Category } from '@/types';

export type CategoryCreate = {
  name: string;
  image?: File;
  description?: string;
};

export const createCategory = (requestData: CategoryCreate) => {
  axiosInstance
    .post('/categories', requestData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(() => console.log('Category created successfully'))
    .catch((error) => {
      console.error('Error creating categories: ' + error.message);
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
  try {
    const response = await axiosInstance.put(`/categories/${id}`, requestData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error updating category: ' + error.message);
    throw error;
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await axiosInstance.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getCategoryById = async (id: number): Promise<Category> => {
  try {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

export const deleteCategory = (id: number) => {
  axiosInstance
    .delete(`/categories/${id}`)
    .then(() => console.log('Category deleted successfully'))
    .catch((error) => console.error(error));
};
