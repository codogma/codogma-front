import { axiosInstance } from '@/helpers/axiosInstance';
import { PaletteDTO } from '@/types';

export type CreateArticleImage = {
  image: File;
  isPreview?: boolean;
  palette?: PaletteDTO;
};

export const uploadArticleImage = async (
  articleId: number,
  requestData: CreateArticleImage,
): Promise<string> => {
  const response = await axiosInstance.post(
    `/images/upload/${articleId}`,
    requestData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};
