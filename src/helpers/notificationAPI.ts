import { axiosInstance } from '@/helpers/axiosInstance';
import { GetNotification } from '@/types';

export type GetNotificationsDTO = {
  totalElements: number;
  totalPages: number;
  content: GetNotification[];
};

export const getNotifications = async (
  isRead?: boolean,
  page: number = 0,
  size: number = 10,
  sort: string = 'updatedAt',
  order: string = 'desc',
): Promise<GetNotificationsDTO> => {
  const response = await axiosInstance.get('/notifications', {
    params: {
      isRead,
      page,
      size,
      sort,
      order,
    },
  });
  return response.data;
};
