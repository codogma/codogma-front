import { axiosInstance } from '@/helpers/axiosInstance';
import { devConsoleInfo } from '@/helpers/devConsoleLogs';
import { dispatchCustomEvent } from '@/helpers/dispatchCustomEvent';
import {
  GetCategory,
  GetCategoryToUpdate,
  Language,
  PaletteDTO,
} from '@/types';

export type CreateCategory = {
  name: Map<Language, string>;
  icon: File;
  image: File;
  palette: PaletteDTO;
  description?: Map<Language, string>;
};

export type UpdateCategory = {
  name?: Map<Language, string>;
  icon?: File;
  image?: File;
  palette?: PaletteDTO;
  description?: Map<Language, string>;
};

export type GetCategoriesDTO = {
  totalElements: number;
  totalPages: number;
  content: GetCategory[];
};

export const createCategory = async (
  requestData: CreateCategory,
): Promise<GetCategory> => {
  const formData = new FormData();

  // Add name Map entries as name[lang] = value
  for (const [lang, value] of requestData.name.entries()) {
    formData.append(`name[${lang}]`, value);
  }

  // Add files
  formData.append('icon', requestData.icon);
  formData.append('image', requestData.image);

  // Add palette as JSON string
  if (requestData.palette) {
    formData.append('palette', JSON.stringify(requestData.palette));
  }

  // Add description Map entries if present
  if (requestData.description) {
    for (const [lang, value] of requestData.description.entries()) {
      formData.append(`description[${lang}]`, value);
    }
  }

  const response = await axiosInstance.post<GetCategory>(
    '/categories',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  dispatchCustomEvent('api', {
    message: 'Category created successfully',
    severity: 'success',
  });
  return response.data;
};

export const getCategoriesByName = async (
  name: string,
): Promise<GetCategory[]> => {
  const response = await axiosInstance.get<GetCategory[]>(
    '/categories/list-by-name',
    {
      params: {
        name,
      },
    },
  );
  return response.data;
};

export const updateCategory = async (
  id: number,
  requestData: UpdateCategory,
): Promise<GetCategory> => {
  const formData = new FormData();

  // Add name Map entries if present
  if (requestData.name) {
    for (const [lang, value] of requestData.name.entries()) {
      formData.append(`name[${lang}]`, value);
    }
  }

  // Add files if present
  if (requestData.icon) {
    formData.append('icon', requestData.icon);
  }
  if (requestData.image) {
    formData.append('image', requestData.image);
  }

  // Add palette as JSON string if present
  if (requestData.palette) {
    formData.append('palette', JSON.stringify(requestData.palette));
  }

  // Add description Map entries if present
  if (requestData.description) {
    for (const [lang, value] of requestData.description.entries()) {
      formData.append(`description[${lang}]`, value);
    }
  }

  const response = await axiosInstance.put<GetCategory>(
    `/categories/${id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
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
  const response = await axiosInstance.get<GetCategoriesDTO>('/categories', {
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
  const response = await axiosInstance.get<GetCategory>(`/categories/${id}`);
  return response.data;
};

export const getCategoryByIdToUpdate = async (
  id: number,
): Promise<GetCategoryToUpdate> => {
  const response = await axiosInstance.get<GetCategoryToUpdate>(
    `/categories/${id}/to-update`,
  );
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/categories/${id}`);
  devConsoleInfo('Category deleted successfully');
};

export const unfavorite = async (id: number): Promise<GetCategory> => {
  const response = await axiosInstance.delete<GetCategory>(
    `/categories/${id}/unfavorite`,
  );
  dispatchCustomEvent('api', {
    message: 'You have successfully removed the category from your favorites',
    severity: 'success',
  });
  return response.data;
};

export const favorite = async (id: number): Promise<GetCategory> => {
  const response = await axiosInstance.post<GetCategory>(
    `/categories/${id}/add-to-favorites`,
  );
  dispatchCustomEvent('api', {
    message: 'You have successfully added the category to your favorites',
    severity: 'success',
  });
  return response.data;
};
