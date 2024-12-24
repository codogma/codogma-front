import { axiosInstance } from '@/helpers/axiosInstance';
import { GetCompilation } from '@/types';

export type GetCompilationsDTO = {
  totalElements: number;
  totalPages: number;
  content: GetCompilation[];
};

export const getCompilations = async (
  tag?: string,
  info?: string,
  isBookmarked?: boolean,
  page: number = 0,
  size: number = 10,
  sort: string = 'updatedAt',
  order: string = 'desc',
): Promise<GetCompilationsDTO> => {
  const response = await axiosInstance.get('/compilations', {
    params: {
      tag,
      info,
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
