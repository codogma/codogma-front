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
      // Проверяем, является ли это retry запросом с явными куками
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((config as any)._isRetry && config.headers?.cookie) {
        // Для retry запросов используем переданные куки как есть
        // devConsoleInfo('Using explicit cookies for retry:', config.headers.cookie);
      } else {
        // Для обычных запросов получаем куки из headers()
        const incoming = await getAllServerHeaders();
        // devConsoleInfo('SSR Request headers:', {
        //   original: config.headers,
        //   incoming: incoming,
        //   hasCookie: !!incoming?.cookie,
        //   cookieLength: incoming?.cookie?.length || 0,
        // });
        config.headers = AxiosHeaders.from({
          ...config.headers,
          ...incoming,
        });
      }
      // devConsoleInfo('Final request headers:', config.headers);
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
      // const serverMessage = error.response?.data ?? 'An unknown error occurred';
      // devConsoleWarn('Axios error status: ' + statusCode);
      // devConsoleWarn('Axios error message: ' + serverMessage);
      // devConsoleWarn('Axios error config:', {
      //   method: error.config?.method,
      //   url: error.config?.url,
      //   baseURL: error.config?.baseURL,
      //   headers: error.config?.headers,
      // });
      if (statusCode) {
        // devConsoleWarn(`Axios error (${statusCode}): ${serverMessage}`);
        if (error.response && statusCode === 401) {
          if (typeof window === 'undefined') {
            // SSR: предотвращаем бесконечные повторы
            if (error.config._isRetry) {
              devConsoleWarn(
                'SSR refresh-token failed, giving up after single retry',
              );
              return Promise.reject(error);
            }

            try {
              devConsoleWarn('Starting SSR refresh-token process');

              // Используем внутренний URL для Route Handler
              const refreshUrl =
                'http://localhost:3000/api/proxy/refresh-token';

              // Получаем куки для передачи в Route Handler
              const incoming = await getAllServerHeaders();
              // devConsoleWarn(
              //   'Current cookies before refresh:',
              //   incoming?.cookie,
              // );

              const resp = await fetch(refreshUrl, {
                method: 'POST',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                  ...incoming,
                },
              });

              if (!resp.ok) {
                const errorData = await resp.json().catch(() => null);
                devConsoleWarn(
                  'SSR refresh-token failed:',
                  resp.status,
                  errorData,
                );
                return Promise.reject(error);
              }

              // Получаем новые куки из ответа proxy route
              const setCookieHeaders = resp.headers.get('set-cookie');
              // devConsoleWarn('New cookies from refresh:', setCookieHeaders);

              // Парсим новые куки и создаем строку cookie для передачи
              let newCookieString = '';
              if (setCookieHeaders) {
                const cookies = Array.isArray(setCookieHeaders)
                  ? setCookieHeaders
                  : [setCookieHeaders];
                const cookiePairs = cookies
                  .map((cookie: string) => {
                    if (cookie) {
                      const [pair] = cookie
                        .split(';')
                        .map((s: string) => s.trim());
                      return pair;
                    }
                    return '';
                  })
                  .filter(Boolean);
                newCookieString = cookiePairs.join('; ');
                // devConsoleWarn('Parsed cookie string:', newCookieString);
              }

              // Retry только один раз для SSR
              const retryConfig = { ...error.config, _isRetry: true };
              if (retryConfig.headers && newCookieString) {
                // Явно устанавливаем новые куки в заголовки
                retryConfig.headers['cookie'] = newCookieString;
                // devConsoleWarn(
                //   'Setting new cookies in retry config:',
                //   newCookieString,
                // );
              }
              // devConsoleWarn('Retrying with config:', retryConfig);
              return axiosInstance(retryConfig);
            } catch (refreshError) {
              devConsoleWarn('SSR refresh-token failed: ', refreshError);
              return Promise.reject(error);
            }
          } else {
            // Client-side: use single global refresh to avoid duplicate refresh calls
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
