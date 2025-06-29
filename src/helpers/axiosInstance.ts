import axios, { isAxiosError } from 'axios';
import { redirect } from 'next/navigation';

import { devConsoleError } from '@/helpers/devConsoleLogs';
import { getAuthToken } from '@/helpers/getCookies';
import { getLocale } from '@/helpers/getLocale';

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    if (typeof window === 'undefined') {
      const authToken = await getAuthToken();
      if (authToken) {
        config.headers['Authorization'] = `Bearer ${authToken}`;
      }
      const intl = await getLocale();
      if (intl) {
        config.headers['Accept-Language'] = intl;
      }
    }
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
      const statusCode = error.response?.status;
      const serverMessage = error.response?.data ?? 'An unknown error occurred';
      devConsoleError('Axios error: ' + serverMessage);
      if (statusCode) {
        devConsoleError(`Axios error (${statusCode}): ${serverMessage}`);
        if (statusCode === 401) {
          window.dispatchEvent(new Event('storage'));
          devConsoleError('Unauthorized access - redirecting to login...');
        } else if (statusCode === 404) {
          redirect('/not-found');
        } else if (statusCode >= 500) {
          devConsoleError('Server error. Please try again later.');
        }
      }
    } else if (error instanceof Error) {
      devConsoleError('An unexpected error occurred: ' + error.message);
    } else {
      devConsoleError('An unexpected error occurred');
    }
    return Promise.reject(error);
  },
);
