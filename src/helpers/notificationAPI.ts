import { axiosInstance } from '@/helpers/axiosInstance';
import { dispatchCustomEvent } from '@/helpers/dispatchCustomEvent';
import { GetNotification, Language } from '@/types';

export type NotificationCreate = {
  title: Map<Language, string>;
  message?: Map<Language, string>;
};

export type NotificationUpdate = {
  title?: Map<Language, string>;
  message?: Map<Language, string>;
};

export type GetNotificationsDTO = {
  totalElements: number;
  totalPages: number;
  content: GetNotification[];
};

export const createNotification = async (
  requestData: NotificationCreate,
): Promise<void> => {
  await axiosInstance.post('/notifications', requestData);
  dispatchCustomEvent('api', {
    message: 'Notification created successfully',
    severity: 'success',
  });
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

export const readAllNotifications = async (): Promise<void> => {
  await axiosInstance.patch(`/notifications/read-all`);
};

export const deleteAllNotifications = async (): Promise<void> => {
  await axiosInstance.delete(`/notifications/delete-all-system`);
};
