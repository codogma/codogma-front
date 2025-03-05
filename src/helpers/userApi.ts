import Cookies from 'js-cookie';

import { axiosInstance } from '@/helpers/axiosInstance';
import { devConsoleInfo } from '@/helpers/devConsoleLogs';
import { dispatchCustomEvent } from '@/helpers/dispatchCustomEvent';
import { GetUserDTO, User, UserRole } from '@/types';

export type GetUsersDTO = {
  totalElements: number;
  totalPages: number;
  content: GetUserDTO[];
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
  targetUsername?: string,
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
      targetUsername,
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

export const getUserByUsername = async (
  username?: string,
): Promise<GetUserDTO> => {
  const response = await axiosInstance.get(`/users/${username}`);
  return response.data;
};

export const deleteUser = async (username: string): Promise<void> => {
  await axiosInstance.delete(`/users/${username}`);
  Cookies.remove('user');
  window.dispatchEvent(new Event('storage'));
  devConsoleInfo('User deleted successfully');
};

export const unsubscribe = async (username: string): Promise<User> => {
  const response = await axiosInstance.delete(`/users/${username}/unsubscribe`);
  dispatchCustomEvent('api', {
    message: 'You have successfully unsubscribed from the author',
    severity: 'success',
  });
  return response.data;
};

export const subscribe = async (username: string): Promise<User> => {
  const response = await axiosInstance.post(`/users/${username}/subscribe`);
  dispatchCustomEvent('api', {
    message: 'You have successfully subscribed to the author',
    severity: 'success',
  });
  return response.data;
};
