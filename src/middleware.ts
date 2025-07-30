import acceptLanguage from 'accept-language';
import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import {
  fallbackLng,
  headerName,
  intlCookie,
  languages,
} from '@/constants/i18n';
import { currentUser } from '@/helpers/authApi';
import { devConsoleWarn } from '@/helpers/devConsoleLogs';
import { getLocale } from '@/helpers/getLocale';
import { routing } from '@/i18n/routing';
import { Language, UserRole } from '@/types';

import { auth } from '@/lib/auth';

export default createMiddleware(routing);

acceptLanguage.languages(languages);

export const config = {
  // Этот matcher охватывает все запросы, кроме api, static, _next и файлов
  matcher: '/((?!api|static|.*\\..*|_next).*)',
};

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const lng = await getLanguage(req);

  // === 1. Проверка аутентификационных токенов ===
  const status = await auth();
  const accessToken = req.cookies.get('access_token')?.value;
  const refreshToken = req.cookies.get('refresh_token')?.value;

  // Если есть сессия NextAuth, но нет токенов бэкенда
  if (!!status && (!accessToken || !refreshToken)) {
    const response = NextResponse.redirect(new URL('/sign-in', req.url));
    response.cookies.delete('authjs.session-token');
    return response;
  }

  // === 2. Логика локализации ===
  const lngInPath = languages.find((loc) => pathname.startsWith(`/${loc}`));
  const headers = new Headers(req.headers);
  headers.set(headerName, lngInPath ?? lng);

  // Если текущий URL не содержит код языка, делаем редирект на URL с языковым префиксом
  if (!lngInPath && !pathname.startsWith('/_next')) {
    const response = redirectTo(`/${lng}${pathname}${search}`, req);
    response.cookies.set(intlCookie, lng, { path: '/' });
    return response;
  }

  // === 3. Логика защиты маршрутов /admin ===
  if (pathname.startsWith(`/${lng}/admin`)) {
    return handleAdminCheck(req);
  }

  return NextResponse.next({ request: { headers } });
}

// Вспомогательные функции
const getLanguage = async (req: NextRequest) => {
  let lng =
    (await getLocale()) ??
    acceptLanguage.get(req.cookies.get(intlCookie)?.value);
  lng ??=
    (acceptLanguage.get(req.headers.get('Accept-Language')) as Language) ??
    fallbackLng;
  return languages.includes(lng) ? lng : fallbackLng;
};

const handleAdminCheck = async (req: NextRequest) => {
  try {
    // Проверяем пользователя через API
    const user = await currentUser();
    if (!user || user.role !== UserRole.ROLE_ADMIN) {
      return redirectTo('/not-found', req);
    }
  } catch (error) {
    // При ошибках аутентификации очищаем куки
    devConsoleWarn(error);
    const response = redirectTo('/not-found', req);
    response.cookies.delete('user');
    return response;
  }

  return NextResponse.next();
};

const redirectTo = (path: string, req: NextRequest) => {
  return NextResponse.redirect(new URL(path, req.url));
};
