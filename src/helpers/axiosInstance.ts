import axios, { isAxiosError } from 'axios';

import { devConsoleError } from '@/helpers/devConsoleLogs';

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    devConsoleError('Request error:', error.message);
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (isAxiosError(error)) {
      const serverMessage = error.response?.data || 'An unknown error occurred';
      devConsoleError('Axios error: ' + serverMessage);
    } else if (error instanceof Error) {
      devConsoleError('An unexpected error occurred: ' + error.message);
    } else {
      devConsoleError('An unexpected error occurred');
    }
    return Promise.reject(error);
  },
);
