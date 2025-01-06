import { axiosInstance } from '@/helpers/axiosInstance';
import { dispatchCustomEvent } from '@/helpers/dispatchCustomEvent';
import { GetCompilation } from '@/types';

export type GetCompilationsDTO = {
  totalElements: number;
  totalPages: number;
  content: GetCompilation[];
};

export type CompilationCreate = {
  title: string;
  image?: File;
  description?: string;
};

export const getCompilations = async (
  tag?: string,
  content?: string,
  username?: string,
  isBookmarked?: boolean,
  page: number = 0,
  size: number = 10,
  sort: string = 'updatedAt',
  order: string = 'desc',
): Promise<GetCompilationsDTO> => {
  const response = await axiosInstance.get('/compilations', {
    params: {
      tag,
      content,
      username,
      isBookmarked,
      page,
      size,
      sort,
      order,
    },
  });
  return response.data;
};

export const getCompilationsByTitle = async (
  title: string,
): Promise<GetCompilation[]> => {
  const response = await axiosInstance.get('/compilations/list-by-title', {
    params: {
      title,
    },
  });
  return response.data;
};

export const getCompilationById = async (
  id: number,
): Promise<GetCompilation> => {
  const response = await axiosInstance.get(`/compilations/${id}`);
  return response.data;
};

export const createCompilation = async (
  requestData: CompilationCreate,
): Promise<void> => {
  await axiosInstance.post('/compilations', requestData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  dispatchCustomEvent('api', {
    message: 'Compilation created successfully',
    severity: 'success',
  });
};
