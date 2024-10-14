import { axiosInstance } from '@/helpers/axiosInstance';
import { Tag } from '@/types';

export type TagCreate = {
  name: string;
};

export const getTagsByName = async (name: string): Promise<Tag[]> => {
  const response = await axiosInstance.get(`/tags?name=${name}`);
  return response.data;
};
