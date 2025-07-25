import { axiosInstance } from '@/helpers/axiosInstance';
import { devConsoleInfo } from '@/helpers/devConsoleLogs';
import { AuthDTO, GetUserDTO } from '@/types';

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

export const signUp = async (requestData: SignUp): Promise<void> => {
  await axiosInstance.post('/auth/sign-up', requestData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  devConsoleInfo('User registered successfully');
};

export const confirmEmail = async (token: string | null): Promise<void> => {
  await axiosInstance.post('/auth/confirm-email', null, {
    params: { token },
  });
};

export const login = async (requestData: SignIn): Promise<AuthDTO> => {
  const response = await axiosInstance.post('/auth/sign-in', requestData);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await axiosInstance.post('/auth/logout');
  devConsoleInfo('User logged out successfully');
};

export const currentUser = async (): Promise<GetUserDTO> => {
  const response = await axiosInstance.get('/auth/current-user');
  return response.data;
};

export const refreshToken = async (): Promise<void> => {
  await axiosInstance.post('/auth/refresh-token');
};
