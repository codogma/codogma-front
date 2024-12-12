import Cookies from 'js-cookie';

import { axiosInstance } from '@/helpers/axiosInstance';
import { devConsoleInfo } from '@/helpers/devConsoleLogs';
import { dispatchCustomEvent } from '@/helpers/dispatchCustomEvent';
import { User, UserRole } from '@/types';

export type GetUsersDTO = {
  totalElements: number;
  totalPages: number;
  content: User[];
};

export type UserUpdate = {
  username?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  newEmail?: string;
  currentPassword?: string;
  newPassword?: string;
  avatar?: File;
  shortInfo?: string;
};

export const updateUser = async (requestData: UserUpdate): Promise<User> => {
  const response = await axiosInstance.put(`/users`, requestData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  const user: User = response.data;
  Cookies.set('user', JSON.stringify(user), {
    secure: true,
    sameSite: 'strict',
  });
  window.dispatchEvent(new Event('storage'));
  dispatchCustomEvent('api', {
    message: 'User updated successfully',
    severity: 'success',
  });
  return user;
};

export const getUsers = async (
  categoryId?: number,
  role?: UserRole,
  tag?: string,
  info?: string,
  isSubscriptions?: boolean,
  isSubscribers?: boolean,
  page: number = 0,
  size: number = 10,
  sort: string = 'username',
  order: string = 'desc',
): Promise<GetUsersDTO> => {
  const response = await axiosInstance.get(`/users`, {
    params: {
      categoryId,
      role,
      tag,
      info,
      isSubscriptions,
      isSubscribers,
      page,
      size,
      sort,
      order,
    },
  });
  return response.data;
};

export const getUserByUsername = async (username?: string): Promise<User> => {
  const response = await axiosInstance.get(`/users/${username}`);
  return response.data;
};

export const deleteUser = async (username: string): Promise<void> => {
  await axiosInstance.delete(`/users/${username}`);
  Cookies.remove('user');
  window.dispatchEvent(new Event('storage'));
  devConsoleInfo('User deleted successfully');
};

export const unsubscribeToUser = async (username: string): Promise<User> => {
  const response = await axiosInstance.delete(`/users/${username}/unsubscribe`);
  return response.data;
};

export const subscribeToUser = async (username: string): Promise<User> => {
  const response = await axiosInstance.post(`/users/${username}/subscribe`);
  return response.data;
};
