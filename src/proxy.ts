import acceptLanguage from 'accept-language';
import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import {
  contlCookie,
  fallbackLng,
  headerName,
  intlCookie,
  languages,
} from '@/constants/i18n';
import { themeConfig } from '@/constants/theme-config';
import { currentUser } from '@/helpers/authApi';
import { devConsoleWarn } from '@/helpers/devConsoleLogs';
import { getLocale } from '@/helpers/getLocale';
import { getTheme } from '@/helpers/getTheme';
import { routing } from '@/i18n/routing';
import { auth } from '@/lib/auth';
import { Language, UserRole } from '@/types';

export default createMiddleware(routing);

acceptLanguage.languages(languages);

export const config = {
  // Этот matcher охватывает все запросы, кроме api, static, _next и файлов
  matcher: '/((?!api|static|.*\\..*|_next).*)',
};

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const lng = await getLanguage(req);

  const response = NextResponse.next();

  // === 0. Установка темы ===
  // Проверяем как cookie, так и системный заголовок
  const theme = getTheme();
  if (theme === undefined) {
    response.cookies.set(
      themeConfig.modeStorageKey,
      themeConfig.defaultDarkColorScheme,
    );
  }

  // === 1. Проверка аутентификационных токенов ===
  const status = await auth();
  const refreshToken = req.cookies.get('refresh_token')?.value;

  // Если есть сессия NextAuth, но нет токенов бэкенда
  if (!!status && !refreshToken) {
    const response = NextResponse.redirect(new URL('/sign-in', req.url));
    response.cookies.delete('authjs.session-token');
    return response;
  }

  // === 2. Логика локализации ===
  const lngInPath = languages.find((loc) => pathname.startsWith(`/${loc}`));
  const headers = new Headers(req.headers);
  headers.set(headerName, lngInPath ?? lng);

  const contlCookieValue = req.cookies.get(contlCookie)?.value;
  if (!contlCookieValue) {
    const defaultContlValue = encodeURIComponent(
      [Language.RU, Language.EN].join(','),
    );
    const existingCookie = req.headers.get('cookie') || '';
    const separator = existingCookie ? '; ' : '';
    const newCookieString = `${existingCookie}${separator}${contlCookie}=${defaultContlValue}`;
    headers.set('cookie', newCookieString);
    response.cookies.set(contlCookie, defaultContlValue);
  }

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
  // 1. Пробуем получить язык из getLocale()
  const lng = await getLocale();
  if (lng && languages.includes(lng)) return lng;

  // 2. Пробуем получить язык из куки intlCookie
  const cookieValue = req.cookies.get(intlCookie)?.value;
  if (cookieValue) {
    const lngFromCookie = acceptLanguage.get(cookieValue);
    if (lngFromCookie && languages.includes(lngFromCookie as Language)) {
      return lngFromCookie;
    }
  }

  // 3. Пробуем получить язык из заголовка Accept-Language
  const acceptLanguageHeader = req.headers.get('Accept-Language');
  if (acceptLanguageHeader) {
    // Разбиваем заголовок на части и обрабатываем каждый язык
    const langs = acceptLanguageHeader
      .split(',')
      .map((lang) => {
        const [code, q] = lang.trim().split(';');
        const weight = q ? parseFloat(q.split('=')[1]) || 1 : 1;
        return { code: code.split('-')[0].toLowerCase(), weight };
      })
      .filter((lang) => languages.includes(lang.code as Language))
      .sort((a, b) => b.weight - a.weight);

    if (langs.length > 0) {
      return langs[0].code;
    }
  }

  // 4. Возвращаем язык по умолчанию
  return fallbackLng;
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
