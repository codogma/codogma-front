import { axiosInstance } from '@/helpers/axiosInstance';
import { User } from '@/types';
import Cookies from 'js-cookie';
import axios, { AxiosError } from 'axios';

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
  try {
    const response = await axiosInstance.post('/auth/sign-up', requestData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('User registered successfully:', response.data);
    return response.data;
  } catch (error: AxiosError | any) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response?.data || 'An unknown error occurred';
      console.error('Error registering user: ' + serverMessage);
    } else {
      console.error('An unexpected error occurred: ' + error.message);
    }
    throw error;
  }
};

export const confirmEmail = async (token: string | null): Promise<string> => {
  try {
    const response = await axiosInstance.post('/auth/confirm-email', null, {
      params: {
        token,
      },
    });
    return response.data;
  } catch (error: AxiosError | any) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response?.data || 'An unknown error occurred';
      console.error('Error confirming email: ' + serverMessage);
    } else {
      console.error('An unexpected error occurred: ' + error.message);
    }
    throw error;
  }
};

export const signIn = async (requestData: SignIn): Promise<User | null> => {
  try {
    await axiosInstance.post('/auth/sign-in', requestData);
    const user = await currentUser();
    window.dispatchEvent(new Event('storage'));
    return user;
  } catch (error: AxiosError | any) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response?.data || 'An unknown error occurred';
      console.error('Error signing in user: ' + serverMessage);
    } else {
      console.error('An unexpected error occurred: ' + error.message);
    }
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await axiosInstance.post('/auth/logout');
    console.log('User logged out successfully');
    Cookies.remove('user');
    window.dispatchEvent(new Event('storage'));
  } catch (error: any) {
    console.error('Error logging out user: ' + error.message);
  }
};

export const currentUser = async (): Promise<User | null> => {
  try {
    const response = await axiosInstance.get('/auth/current-user');
    if (response.data) {
      const user: User = response.data;
      Cookies.set('user', JSON.stringify(user), {
        secure: true,
        sameSite: 'strict',
      });
      return user;
    }
    Cookies.remove('user');
    window.dispatchEvent(new Event('storage'));
    return null;
  } catch {
    throw new Error('Error fetching current user');
  }
};

export const refreshToken = async (): Promise<void> => {
  try {
    return await axiosInstance.post('/auth/refresh-token');
  } catch {
    throw new Error('Error fetching current user');
  }
};
