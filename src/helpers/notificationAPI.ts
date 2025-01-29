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

export const deleteNotification = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/notifications/${id}/delete-system`);
};

export const readNotification = async (id: number): Promise<void> => {
  await axiosInstance.patch(`/notifications/${id}/read`);
};

export const deleteAllNotifications = async (): Promise<void> => {
  await axiosInstance.delete(`/notifications/delete-all-system`);
};
