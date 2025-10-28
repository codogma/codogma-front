import axios, {
  AxiosHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { redirect } from 'next/navigation';
import { signOut } from 'next-auth/react';

import { devConsoleInfo, devConsoleWarn } from '@/helpers/devConsoleLogs';
import { getAllServerHeaders } from '@/helpers/getAllServerHeaders';
import { auth } from '@/lib/auth';

const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in ms

function decodeJWT(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = Buffer.from(payload, 'base64url').toString('utf8');
    return JSON.parse(decoded);
  } catch (error) {
    devConsoleWarn('JWT decode error:', error);
    return null;
  }
}

function isTokenExpiringSoon(
  token: string | undefined,
  thresholdMs: number = TOKEN_REFRESH_THRESHOLD,
): boolean {
  if (token === undefined) return true;
  const decoded = decodeJWT(token);
  devConsoleInfo('Decoded JWT:', decoded);
  if (!decoded) return true;
  const expiresAt = decoded.exp * 1000;
  const now = Date.now();
  const timeUntilExpiry = expiresAt - now;

  devConsoleInfo(`Token expires at: ${new Date(expiresAt).toISOString()}`);
  devConsoleInfo(`Time until expiry: ${timeUntilExpiry}ms`);

  return timeUntilExpiry < thresholdMs;
}

async function callRefreshProxy() {
  // NEXT_PUBLIC_DOMAIN это http://localhost:3000
  const refreshUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/api/proxy/refresh-token`;

  const incoming = await getAllServerHeaders();

  const resp = await fetch(refreshUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(incoming || {}),
    },
    credentials: 'include',
  });

  const status = resp.status;

  let bodyJson = null;
  try {
    bodyJson = await resp
      .clone()
      .json()
      .catch(() => null);
  } catch {
    bodyJson = null;
  }

  const rawSetCookie = resp.headers.get('set-cookie');
  let setCookieHeaders: string[] = [];

  if (Array.isArray((bodyJson && bodyJson.setCookies) ?? null)) {
    setCookieHeaders = bodyJson.setCookies;
  } else if (rawSetCookie) {
    setCookieHeaders = rawSetCookie
      .split(/,(?=\s*[A-Za-z0-9_\\-]+=)/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  let cookieString: string | null = null;
  if (bodyJson?.cookieString) {
    cookieString = bodyJson.cookieString;
  } else if (setCookieHeaders.length > 0) {
    const pairs: string[] = setCookieHeaders
      .map((hdr) => {
        const [pair] = hdr.split(';');
        return pair?.trim();
      })
      .filter(Boolean);
    cookieString = pairs.join('; ');
  }

  return {
    status,
    cookieString,
    setCookieHeaders,
  };
}

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// TODO: возможно надо будет добавить обновление токенов на клиенте или вообще добавить эту логику в lib/auth
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig & { _isRetry?: boolean }) => {
    if (typeof window === 'undefined') {
      const status = await auth();
      devConsoleInfo(status);
      if (!config._isRetry) {
        const incoming = await getAllServerHeaders();
        config.headers = AxiosHeaders.from({
          ...config.headers,
          ...incoming,
        });

        // Проверяем срок действия access token
        const cookies = incoming?.cookie;
        const accessToken = cookies
          ?.split(';')
          .find((c) => c.trim().startsWith('access_token='))
          ?.split('=')[1];

        if (isTokenExpiringSoon(accessToken)) {
          devConsoleWarn('Access token expiring soon - refreshing tokens...');
          try {
            const { cookieString } = await callRefreshProxy();
            if (cookieString) {
              config.headers.set('cookie', cookieString);
            }
          } catch (error) {
            devConsoleWarn('Token refresh failed:', error);
          }
        }
      }
      devConsoleInfo('Final request headers:', config.headers);
    }
    return config;
  },
  (error) => {
    devConsoleWarn('Request error:', error.message);
    return Promise.reject(error);
  },
);

let isRefreshing = false;
let isSSRRefreshing = false;
let refreshPromise: Promise<AxiosResponse> | null = null;

axiosInstance.interceptors.response.use(
  (response) => {
    devConsoleInfo('Response headers:', response.headers);
    return response;
  },
  async (error) => {
    if (error) {
      const statusCode = error.response?.status;
      const securityEvent = error.response?.headers['x-security-event'];
      const serverMessage = error.response?.data ?? 'An unknown error occurred';
      devConsoleWarn('Axios error status: ' + statusCode);
      devConsoleWarn('Axios error message: ' + serverMessage);
      devConsoleWarn('Axios error config:', {
        method: error.config?.method,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        headers: error.config?.headers,
      });
      if (statusCode === 401) {
        if (typeof window === 'undefined') {
          // SSR: предотвращаем бесконечные повторы
          if (error.config._isRetry || isSSRRefreshing) {
            devConsoleWarn(
              'SSR refresh-token failed, giving up after single retry',
            );
            return Promise.reject(error);
          }
          if (
            securityEvent === 'access_token_expired' ||
            securityEvent === 'access_token_missing' ||
            !securityEvent
          ) {
            try {
              isSSRRefreshing = true;
              devConsoleWarn('Starting SSR refresh-token process');

              // Используем внутренний URL для Route Handler
              const refreshUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/api/proxy/refresh-token`;

              // Получаем куки для передачи в Route Handler
              const incoming = await getAllServerHeaders();
              devConsoleWarn(
                'Current cookies before refresh:',
                incoming?.cookie,
              );

              const resp = await fetch(refreshUrl, {
                method: 'POST',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                  ...(incoming || {}),
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

              devConsoleWarn('Backend refresh response status:', resp.status);
              devConsoleWarn('SSR refresh-token successful');

              // Получаем новые куки из ответа proxy route
              const setCookieHeaders = resp.headers.get('set-cookie');
              const cookieArray = resp.headers.getSetCookie?.() || [];

              devConsoleWarn('Set-Cookie headers:', setCookieHeaders);
              devConsoleWarn('Cookie array:', cookieArray);

              // Парсим новые куки и создаем строку cookie для передачи
              let newCookieString = incoming?.cookie || '';

              if (setCookieHeaders) {
                const newCookies = new Map();

                // Сначала добавляем существующие куки
                if (incoming?.cookie) {
                  incoming.cookie.split('; ').forEach((cookie) => {
                    const [key, value] = cookie.split('=');
                    if (key && value) newCookies.set(key.trim(), value.trim());
                  });
                }

                // Парсим новые куки из Set-Cookie заголовков
                setCookieHeaders.split(', ').forEach((cookieString) => {
                  // Берем только первую часть до первой точки с запятой
                  const [cookiePart] = cookieString.split(';');
                  const [key, value] = cookiePart.split('=');
                  if (key && value) {
                    newCookies.set(key.trim(), value.trim());
                  }
                });

                // Формируем новую строку куки
                newCookieString = Array.from(newCookies.entries())
                  .map(([key, value]) => `${key}=${value}`)
                  .join('; ');

                devConsoleWarn('Parsed cookie string:', newCookieString);
              }

              // Retry только один раз для SSR
              const retryConfig = {
                ...error.config,
                _isRetry: true,
                headers: {
                  ...error.config.headers,
                  cookie: newCookieString, // Устанавливаем новые куки
                },
              };

              // Принудительно нормализуем метод запроса (исключаем некорректные значения после SSR/fetch ретрая)
              retryConfig.method =
                typeof retryConfig.method === 'string' &&
                [
                  'get',
                  'post',
                  'put',
                  'patch',
                  'delete',
                  'head',
                  'options',
                ].includes(retryConfig.method.toLowerCase())
                  ? retryConfig.method
                  : 'get';

              if (['get', 'head'].includes(retryConfig.method)) {
                delete retryConfig.data;
              }

              devConsoleWarn('Retrying with config:', retryConfig);
              return axiosInstance(retryConfig);
            } catch (refreshError) {
              devConsoleWarn('SSR refresh-token failed: ', refreshError);
              return Promise.reject(error);
            } finally {
              isSSRRefreshing = false;
            }
          }
        } else {
          // Client-side: use single global refresh to avoid duplicate refresh calls
          devConsoleInfo('Client-side 401 detected:', securityEvent);
          if (
            !isRefreshing &&
            !error.config._isRetry &&
            securityEvent &&
            (securityEvent === 'access_token_expired' ||
              securityEvent === 'access_token_missing')
          ) {
            try {
              devConsoleInfo(securityEvent);
              isRefreshing = true;
              refreshPromise ??= axiosInstance.post('/auth/refresh-token');
              devConsoleWarn('Access token expired - refresh tokens...');
              await refreshPromise;
              error.config._isRetry = true;
              return axiosInstance(error.config);
            } catch (refreshError) {
              devConsoleWarn('Client refresh failed:', refreshError);
              redirect('/sign-in');
            } finally {
              isRefreshing = false;
              refreshPromise = null;
            }
          }
          if (
            [
              'device_mismatch',
              'invalid_refresh_token',
              'refresh_token_expired',
              'refresh_token_revoked',
            ].includes(securityEvent)
          ) {
            devConsoleInfo(securityEvent);
            await signOut({ redirect: true, redirectTo: '/sign-in' });
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
    return Promise.reject(error);
  },
);
