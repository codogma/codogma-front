import Cookies from 'js-cookie';

import { axiosInstance } from '@/helpers/axiosInstance';
import { devConsoleInfo } from '@/helpers/devConsoleLogs';
import { User, UserRole } from '@/types';

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
  devConsoleInfo('User updated successfully');
  return user;
};

export const getUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get('/users');
  return response.data;
};

export const getAuthors = async (categoryId?: number): Promise<User[]> => {
  const response = await axiosInstance.get(`/users`, {
    params: {
      categoryId,
      role: UserRole.ROLE_AUTHOR,
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

export const checkSubscription = async (username: string): Promise<boolean> => {
  const response = await axiosInstance.get(`/users/${username}/is-subscribed`);
  return response.data;
};

export const unsubscribeToUser = async (username: string): Promise<void> => {
  await axiosInstance.delete(`/users/${username}/unsubscribe`);
};

export const subscribeToUser = async (username: string): Promise<void> => {
  await axiosInstance.post(`/users/${username}/subscribe`);
};
