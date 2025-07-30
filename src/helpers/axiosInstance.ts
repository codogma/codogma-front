import axios, { AxiosHeaders, AxiosResponse } from 'axios';
import { redirect } from 'next/navigation';
import { signOut } from 'next-auth/react';

import { devConsoleWarn } from '@/helpers/devConsoleLogs';

import { getAllServerHeaders } from '@/helpers/getAllServerHeaders';

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
      const incoming = await getAllServerHeaders();
      config.headers = AxiosHeaders.from({
        ...config.headers,
        ...incoming,
      });
    }
    return config;
  },
  (error) => {
    devConsoleWarn('Request error:', error.message);
    return Promise.reject(error);
  },
);

let isRefreshing = false;
let refreshPromise: Promise<AxiosResponse> | null = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error) {
      const statusCode = error.response?.status;
      const securityEvent = error.response?.headers['x-security-event'];
      const serverMessage = error.response?.data ?? 'An unknown error occurred';
      devConsoleWarn('Axios error status: ' + statusCode);
      devConsoleWarn('Axios error message: ' + serverMessage);
      if (statusCode) {
        devConsoleWarn(`Axios error (${statusCode}): ${serverMessage}`);
        if (error.response && statusCode === 401) {
          if (!isRefreshing && !securityEvent && !error.config._isRetry) {
            isRefreshing = true;
            refreshPromise = axiosInstance.post('/auth/refresh-token');
            devConsoleWarn('Access token expired - refresh tokens...');
          } else if (
            securityEvent === 'device_mismatch' ||
            securityEvent === 'invalid_refresh_token' ||
            securityEvent === 'token_expired'
          ) {
            await signOut({ redirect: true, redirectTo: '/sign-in' });
          }
          try {
            await refreshPromise;
            error.config._isRetry = true;
            return axiosInstance(error.config);
          } catch (refreshError) {
            devConsoleWarn(refreshError);
            redirect('/sign-in');
          } finally {
            isRefreshing = false;
            refreshPromise = null;
          }
        } else if (statusCode === 403) {
          devConsoleWarn(
            'Access forbidden: You do not have permission to access this resource',
          );
          redirect('/forbidden');
        } else if (statusCode === 404) {
          redirect('/not-found');
        } else if (statusCode >= 500) {
          devConsoleWarn('Server error. Please try again later.');
        }
      }
    } else if (error instanceof Error) {
      devConsoleWarn('An unexpected error occurred: ' + error.message);
    } else {
      devConsoleWarn('An unexpected error occurred');
    }
    return Promise.reject(error);
  },
);
