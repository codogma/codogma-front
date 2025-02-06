import { axiosInstance } from '@/helpers/axiosInstance';
import { GetTag } from '@/types';

export type TagCreate = {
  name: string;
};

export const getTagsByName = async (name: string): Promise<GetTag[]> => {
  const response = await axiosInstance.get('/tags', {
    params: { name },
  });
  return response.data;
};
