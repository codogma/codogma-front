import axios, {
  AxiosError,
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

type JwtPayload = {
  exp: number;
  [key: string]: unknown;
};

type RefreshProxyResult = {
  status: number;
  cookieString: string | null;
  setCookieHeaders: string[];
};

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _isRetry?: boolean;
};

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null;

const toError = (e: unknown, fallbackMessage: string): Error => {
  if (e instanceof Error) return e;
  if (typeof e === 'string') return new Error(e);
  return new Error(fallbackMessage);
};

const toHeaderRecord = (v: unknown): Record<string, string> => {
  if (!isRecord(v)) return {};
  const out: Record<string, string> = {};
  for (const [k, val] of Object.entries(v)) {
    if (typeof val === 'string') out[k] = val;
  }
  return out;
};

/**
 * На случай если где-то исторически getAllServerHeaders возвращал массив,
 * или если devConsoleInfo/обёртка меняет форму.
 */
const normalizeIncomingHeaders = (
  incoming: unknown,
): Record<string, string> => {
  if (Array.isArray(incoming)) return toHeaderRecord(incoming[0]);
  return toHeaderRecord(incoming);
};

const base64UrlDecodeUtf8 = (input: string): string => {
  const base64 = input.replaceAll('-', '+').replaceAll('_', '/');
  const padLength = (4 - (base64.length % 4)) % 4;
  const padded = base64 + '='.repeat(padLength);

  // SSR (node)
  if (typeof window === 'undefined') {
    return Buffer.from(padded, 'base64').toString('utf8');
  }

  // Browser
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
};

function decodeJWT(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    if (!payload) return null;

    const decodedText = base64UrlDecodeUtf8(payload);
    const parsed: unknown = JSON.parse(decodedText);

    if (!isRecord(parsed)) return null;
    if (typeof parsed.exp !== 'number') return null;

    return parsed as JwtPayload;
  } catch (error: unknown) {
    devConsoleWarn('JWT decode error:', error);
    return null;
  }
}

function isTokenExpiringSoon(
  token: string | undefined,
  thresholdMs: number = TOKEN_REFRESH_THRESHOLD,
): boolean {
  // Важно: undefined тут НЕ значит "истекает" — решение принимает вызывающий код
  if (token === undefined) return false;

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

const parseCookieHeaderToMap = (
  cookieHeader: string | undefined,
): Map<string, string> => {
  const map = new Map<string, string>();
  if (!cookieHeader) return map;

  cookieHeader.split(';').forEach((pair) => {
    const p = pair.trim();
    if (!p) return;
    const idx = p.indexOf('=');
    if (idx <= 0) return;
    const key = p.slice(0, idx).trim();
    const value = p.slice(idx + 1).trim();
    if (!key) return;
    map.set(key, value);
  });

  return map;
};

const parseSetCookieToPairs = (setCookie: string): Array<[string, string]> => {
  // set-cookie: "key=value; Path=/; HttpOnly; ..."
  const [cookiePart] = setCookie.split(';');
  if (!cookiePart) return [];
  const idx = cookiePart.indexOf('=');
  if (idx <= 0) return [];
  const key = cookiePart.slice(0, idx).trim();
  const value = cookiePart.slice(idx + 1).trim();
  if (!key) return [];
  return [[key, value]];
};

const buildCookieStringFromMap = (map: Map<string, string>): string =>
  Array.from(map.entries())
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');

const readSetCookieHeaders = (hdrs: Headers): string[] => {
  // 1) Node/undici: getSetCookie() -> string[]
  const maybeHeaders: unknown = hdrs as unknown;
  if (isRecord(maybeHeaders)) {
    const fn = maybeHeaders['getSetCookie'];
    if (typeof fn === 'function') {
      const result: unknown = (fn as (this: Headers) => unknown).call(hdrs);
      if (Array.isArray(result) && result.every((x) => typeof x === 'string')) {
        return result;
      }
    }
  }

  // 2) Fallback: single combined header (редко, но бывает)
  const raw = hdrs.get('set-cookie');
  if (!raw) return [];

  return raw
    .split(/,(?=\s*[A-Za-z0-9_\\-]+=)/)
    .map((s) => s.trim())
    .filter(Boolean);
};

const mergeCookies = (
  existingCookieHeader: string | undefined,
  setCookieHeaders: string[],
): string => {
  const map = parseCookieHeaderToMap(existingCookieHeader);

  for (const sc of setCookieHeaders) {
    for (const [k, v] of parseSetCookieToPairs(sc)) {
      map.set(k, v);
    }
  }

  return buildCookieStringFromMap(map);
};

const extractCookieValue = (
  cookieHeader: string | undefined,
  cookieName: string,
): string | undefined => {
  if (!cookieHeader) return undefined;
  const map = parseCookieHeaderToMap(cookieHeader);
  return map.get(cookieName);
};

/**
 * SSR refresh через Next proxy route.
 * Возвращает cookieString, в котором сохранены старые cookies + обновлённые пары из Set-Cookie.
 */
async function callRefreshProxy(
  existingCookieHeader: string | undefined,
): Promise<RefreshProxyResult> {
  const refreshUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/api/proxy/refresh-token`;

  const incomingRaw = await getAllServerHeaders();
  const incoming = normalizeIncomingHeaders(incomingRaw);

  const resp = await fetch(refreshUrl, {
    method: 'POST',
    headers: {
      // Важно: для route handler достаточно JSON, а cookie прокинется из incoming
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...incoming,
    },
    credentials: 'include',
  });

  const status = resp.status;

  const setCookieHeaders = readSetCookieHeaders(resp.headers);

  // Собираем НОВУЮ cookie-строку для ретрая SSR запроса
  const cookieString =
    setCookieHeaders.length > 0
      ? mergeCookies(existingCookieHeader ?? incoming.cookie, setCookieHeaders)
      : null;

  return { status, cookieString, setCookieHeaders };
}

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// SSR refresh-lock (чтобы не делать параллельные refresh во время SSR)
let isSSRTokenRefreshInProgress = false;

axiosInstance.interceptors.request.use(
  async (config: RetryableRequestConfig) => {
    if (typeof window === 'undefined') {
      const status = await auth();
      devConsoleInfo('Status data: ', status);

      const incomingRaw = await getAllServerHeaders();
      const incoming = normalizeIncomingHeaders(incomingRaw);

      // 1) Прокидываем cookies и безопасные заголовки в axios запрос на backend
      config.headers = AxiosHeaders.from({
        ...config.headers,
        ...incoming,
      });

      // 2) Для API-запросов фиксируем Accept, чтобы не улетало "text/html,..."
      // (это не ломает SSR, но снижает риск неправильного контент-неготиэйшена на backend)
      config.headers.set('Accept', 'application/json');

      // 3) Proactive refresh (как раньше), но только если есть refresh_token
      if (!config._isRetry) {
        const cookieHeader = incoming.cookie;

        const refreshToken = extractCookieValue(cookieHeader, 'refresh_token');
        if (refreshToken) {
          const accessToken = extractCookieValue(cookieHeader, 'access_token');

          const shouldRefresh =
            accessToken === undefined || isTokenExpiringSoon(accessToken);

          if (shouldRefresh && !isSSRTokenRefreshInProgress) {
            isSSRTokenRefreshInProgress = true;
            devConsoleWarn(
              'Access token expiring soon/missing - refreshing tokens...',
            );

            try {
              const { cookieString } = await callRefreshProxy(cookieHeader);
              if (cookieString) {
                config.headers.set('cookie', cookieString);
              }
            } catch (error: unknown) {
              devConsoleWarn('Token refresh failed:', error);
            } finally {
              isSSRTokenRefreshInProgress = false;
            }
          }
        }
      }

      devConsoleInfo('Final request headers:', config.headers);
    }

    return config;
  },
  (error: unknown) => {
    const err = toError(error, 'Request interceptor error');
    devConsoleWarn('Request error:', err.message);
    return Promise.reject(err);
  },
);

let isRefreshing = false;
let isSSRRefreshing = false;
let refreshPromise: Promise<AxiosResponse<unknown>> | null = null;

axiosInstance.interceptors.response.use(
  (response) => {
    devConsoleInfo('Response headers:', response.headers);
    return response;
  },
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      throw toError(error, 'Non-Axios error');
    }

    const axiosError: AxiosError = error;
    const statusCode = axiosError.response?.status;

    const securityEvent =
      typeof axiosError.response?.headers?.['x-security-event'] === 'string'
        ? axiosError.response.headers['x-security-event']
        : undefined;

    const serverMessage =
      typeof axiosError.response?.data === 'string'
        ? axiosError.response.data
        : 'An unknown error occurred';

    devConsoleWarn('Axios error status: ' + statusCode);
    devConsoleWarn('Axios error message: ' + serverMessage);
    devConsoleWarn('Axios error config:', {
      method: axiosError.config?.method,
      url: axiosError.config?.url,
      baseURL: axiosError.config?.baseURL,
      headers: axiosError.config?.headers,
    });

    const cfg = axiosError.config as RetryableRequestConfig | undefined;
    const alreadyRetried = Boolean(cfg?._isRetry);

    if (statusCode === 401) {
      // =========================
      // SSR flow
      // =========================
      if (typeof window === 'undefined') {
        if (alreadyRetried || isSSRRefreshing) {
          devConsoleWarn(
            'SSR refresh-token failed, giving up after single retry',
          );
          throw axiosError;
        }

        if (
          securityEvent === 'access_token_expired' ||
          securityEvent === 'access_token_missing' ||
          !securityEvent
        ) {
          try {
            isSSRRefreshing = true;
            devConsoleWarn('Starting SSR refresh-token process');

            const incomingRaw = await getAllServerHeaders();
            const incoming = normalizeIncomingHeaders(incomingRaw);

            const existingCookieHeader = incoming.cookie;
            devConsoleWarn(
              'Current cookies before refresh:',
              existingCookieHeader,
            );

            // Делаем refresh через proxy и собираем корректный cookieString для ретрая
            const { status, cookieString } =
              await callRefreshProxy(existingCookieHeader);

            if (!cookieString || status < 200 || status >= 300) {
              devConsoleWarn('SSR refresh-token failed:', status);
              throw axiosError;
            }

            if (!cfg) {
              throw axiosError;
            }

            const retryConfig: RetryableRequestConfig = {
              ...cfg,
              _isRetry: true,
              headers: AxiosHeaders.from({
                ...cfg.headers,
                cookie: cookieString,
                Accept: 'application/json',
              }),
            };

            // Нормализуем method (как и раньше)
            const method =
              typeof retryConfig.method === 'string'
                ? retryConfig.method
                : 'get';
            const methodLower = method.toLowerCase();
            const allowedMethods = [
              'get',
              'post',
              'put',
              'patch',
              'delete',
              'head',
              'options',
            ] as const;

            retryConfig.method = (allowedMethods as readonly string[]).includes(
              methodLower,
            )
              ? methodLower
              : 'get';

            if (retryConfig.method === 'get' || retryConfig.method === 'head') {
              delete (retryConfig as Partial<RetryableRequestConfig>).data;
            }

            devConsoleWarn('Retrying with config:', retryConfig);
            return axiosInstance.request(retryConfig);
          } catch (refreshError: unknown) {
            devConsoleWarn('SSR refresh-token failed: ', refreshError);
            throw axiosError;
          } finally {
            isSSRRefreshing = false;
          }
        }

        throw axiosError;
      }

      // =========================
      // Client flow
      // =========================
      devConsoleInfo('Client-side 401 detected:', securityEvent);

      if (
        !isRefreshing &&
        !alreadyRetried &&
        securityEvent &&
        (securityEvent === 'access_token_expired' ||
          securityEvent === 'access_token_missing')
      ) {
        try {
          devConsoleInfo('Security Event: ', securityEvent);

          isRefreshing = true;
          refreshPromise ??= axiosInstance.post('/auth/refresh-token');

          devConsoleWarn('Access token expired - refresh tokens...');
          await refreshPromise;

          if (cfg) cfg._isRetry = true;
          return cfg ? axiosInstance.request(cfg) : Promise.reject(axiosError);
        } catch (refreshError: unknown) {
          devConsoleWarn('Client refresh failed:', refreshError);
          redirect('/sign-in'); // never
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      }

      if (
        securityEvent &&
        [
          'device_mismatch',
          'invalid_refresh_token',
          'refresh_token_expired',
          'refresh_token_revoked',
        ].includes(securityEvent)
      ) {
        devConsoleInfo('Security Event: ', securityEvent);
        await signOut({ redirect: true, redirectTo: '/sign-in' });
        throw new Error('Signed out');
      }

      throw axiosError;
    }

    if (statusCode === 403) {
      devConsoleWarn(
        'Access forbidden: You do not have permission to access this resource',
      );
      redirect('/forbidden'); // never
    }

    if (statusCode === 404) {
      redirect('/not-found'); // never
    }

    if (typeof statusCode === 'number' && statusCode >= 500) {
      devConsoleWarn('Server error. Please try again later.');
    }

    throw axiosError;
  },
);
