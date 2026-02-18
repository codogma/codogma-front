import { axiosInstance } from '@/helpers/axiosInstance';
import { devConsoleInfo } from '@/helpers/devConsoleLogs';
import { dispatchCustomEvent } from '@/helpers/dispatchCustomEvent';
import { GetArticle, GetCompilation } from '@/types';

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

export type UpdateCompilationDTO = {
  image?: File;
  title?: string;
  description?: string;
  articleIds?: number[];
};

export const getCompilations = async (
  tag?: string,
  content?: string,
  username?: string | null,
  isBookmarked?: boolean,
  page: number = 0,
  size: number = 10,
  sort: string = 'updatedAt',
  order: string = 'desc',
): Promise<GetCompilationsDTO> => {
  const response = await axiosInstance.get<GetCompilationsDTO>(
    '/compilations',
    {
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
    },
  );
  return response.data;
};

export const getCompilationsByTitle = async (
  title: string,
): Promise<GetCompilation[]> => {
  const response = await axiosInstance.get<GetCompilation[]>(
    '/compilations/list-by-title',
    {
      params: {
        title,
      },
    },
  );
  return response.data;
};

export const getCompilationById = async (
  id: number,
): Promise<GetCompilation> => {
  const response = await axiosInstance.get<GetCompilation>(
    `/compilations/${id}`,
  );
  return response.data;
};

export const createCompilation = async (
  requestData: CompilationCreate,
): Promise<GetCompilation> => {
  const formData = new FormData();

  formData.append('title', requestData.title);

  if (requestData.image) {
    formData.append('image', requestData.image);
  }

  if (requestData.description) {
    formData.append('description', requestData.description);
  }

  const response = await axiosInstance.post<GetCompilation>(
    '/compilations',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  dispatchCustomEvent('api', {
    message: 'Compilation created successfully',
    severity: 'success',
  });
  return response.data;
};

export const bookmark = async (id: number): Promise<GetArticle> => {
  const response = await axiosInstance.post<GetArticle>(
    `/compilations/${id}/bookmark`,
  );
  dispatchCustomEvent('api', {
    message: 'You have successfully added the compilation to your bookmarks',
    severity: 'success',
  });
  return response.data;
};

export const unbookmark = async (id: number): Promise<GetArticle> => {
  const response = await axiosInstance.delete<GetArticle>(
    `/compilations/${id}/unbookmark`,
  );
  dispatchCustomEvent('api', {
    message:
      'You have successfully removed the compilation from your bookmarks',
    severity: 'success',
  });
  return response.data;
};

export const updateCompilation = async (
  id: number,
  requestData: UpdateCompilationDTO,
): Promise<GetCompilation> => {
  const formData = new FormData();

  if (requestData.title) {
    formData.append('title', requestData.title);
  }

  if (requestData.image) {
    formData.append('image', requestData.image);
  }

  if (requestData.description) {
    formData.append('description', requestData.description);
  }

  if (requestData.articleIds) {
    for (const articleId of requestData.articleIds) {
      formData.append('articleIds', articleId.toString());
    }
  }

  const response = await axiosInstance.put<GetCompilation>(
    `/compilations/${id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  dispatchCustomEvent('api', {
    message: 'Compilation updated successfully',
    severity: 'success',
  });
  return response.data;
};

export const deleteCompilation = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/compilations/${id}`);
  devConsoleInfo('Compilation deleted successfully');
};
