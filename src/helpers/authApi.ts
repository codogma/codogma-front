import Cookies from 'js-cookie';

import { axiosInstance } from '@/helpers/axiosInstance';
import { devConsoleInfo } from '@/helpers/devConsoleLogs';
import { User } from '@/types';

export type SignUp = {
  username: string;
  email: string;
  password: string;
  avatar: File;
};

export type SignIn = {
  usernameOrEmail: string;
  password: string;
};

export const signUp = async (requestData: SignUp): Promise<string> => {
  const response = await axiosInstance.post('/auth/sign-up', requestData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  devConsoleInfo('User registered successfully:', response.data);
  return response.data;
};

export const confirmEmail = async (token: string | null): Promise<string> => {
  const response = await axiosInstance.post('/auth/confirm-email', null, {
    params: {
      token,
    },
  });
  return response.data;
};

export const signIn = async (requestData: SignIn): Promise<User | null> => {
  await axiosInstance.post('/auth/sign-in', requestData);
  const user = await currentUser();
  window.dispatchEvent(new Event('storage'));
  return user;
};

export const logout = async (): Promise<void> => {
  await axiosInstance.post('/auth/logout');
  devConsoleInfo('User logged out successfully');
  window.dispatchEvent(new Event('storage'));
};

export const currentUser = async (): Promise<User | null> => {
  const response = await axiosInstance.get('/auth/current-user');
  const user: User = response.data;
  if (user) {
    Cookies.set('user', JSON.stringify(user), {
      secure: true,
      sameSite: 'strict',
    });
  }
  return user;
};

export const refreshToken = async (): Promise<void> => {
  return await axiosInstance.post('/auth/refresh-token');
};
