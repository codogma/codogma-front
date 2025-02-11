import acceptLanguage from 'accept-language';
import { NextRequest, NextResponse } from 'next/server';

import { fallbackLng, intlCookie, languages } from '@/constants/i18n';
import { currentUser } from '@/helpers/authApi';
import { devConsoleError } from '@/helpers/devConsoleLogs';
import { UserRole } from '@/types';

acceptLanguage.languages(languages);

export const config = {
  // Этот matcher охватывает все запросы, кроме api, static, _next и файлов
  matcher: '/((?!api|static|.*\\..*|_next).*)',
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const lng = getLanguage(req);

  // === 1. Логика локализации ===
  // Если текущий URL не содержит код языка, делаем редирект на URL с языковым префиксом
  if (!languages.some((loc) => pathname.startsWith(`/${loc}`))) {
    const response = redirectTo(req, `/${lng}${pathname}`);
    response.cookies.set(intlCookie, lng, { path: '/' });
    return response;
  }

  // === 2. Логика защиты маршрутов /admin ===
  if (pathname.startsWith(`/${lng}/admin`)) {
    return handleAdminCheck(req);
  }

  return NextResponse.next();
}

// Вспомогательные функции
const getLanguage = (req: NextRequest) => {
  let lng = req.cookies.get(intlCookie)?.value;
  if (!lng)
    lng = acceptLanguage.get(req.headers.get('Accept-Language')) ?? fallbackLng;
  return languages.includes(lng) ? lng : fallbackLng;
};

const handleAdminCheck = async (req: NextRequest) => {
  try {
    // Проверяем пользователя через API
    const user = await currentUser();
    if (!user || user.role !== UserRole.ROLE_ADMIN) {
      return redirectTo(req, '/not-found');
    }
  } catch (error) {
    // При ошибках аутентификации очищаем куки
    devConsoleError(error);
    const response = redirectTo(req, '/not-found');
    response.cookies.delete('user');
    return response;
  }

  return NextResponse.next();
};

const redirectTo = (req: NextRequest, path: string) => {
  return NextResponse.redirect(new URL(path, req.url));
};
