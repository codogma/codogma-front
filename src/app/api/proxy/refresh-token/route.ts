import axios from 'axios';
import { NextResponse } from 'next/server';

import { devConsoleInfo } from '@/helpers/devConsoleLogs';
import { getAllServerHeaders } from '@/helpers/getAllServerHeaders';
import { setCookies } from '@/helpers/setCookies';

/**
 * Архитектурно корректный proxy route handler для обновления refresh/access токена.
 * Использует cookies().set внутри разрешённого контекста Route Handler (Next.js 14+ appDir).
 * frontend (SSR/Client) вместо запроса напрямую backend-API, вызывает этот proxy endpoint.
 */
export async function POST() {
  // Логируем куки, приходящие в SSR-запросе
  const incoming = await getAllServerHeaders();

  // Если нет кук - сразу возвращаем ошибку
  if (!incoming) {
    return NextResponse.json(
      { error: 'No authentication cookies found' },
      { status: 401 },
    );
  }

  // Делаем запрос к backend с куками
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/refresh-token`,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...incoming,
      },
      withCredentials: true,
      timeout: 10000, // 10 секунд таймаут
    },
  );

  devConsoleInfo('Backend refresh response status:', response.status);
  // devConsoleInfo(
  //   'Backend refresh response set-cookie:',
  //   response.headers['set-cookie'],
  // );

  // Создаем ответ
  const nextResponse = NextResponse.json(response.data, {
    status: response.status,
  });

  // Прокидываем set-cookie из backend ответа в ответ пользователю через cookies().set
  const setCookieHeaders = response.headers['set-cookie'];

  // devConsoleInfo('Setting cookies in NextResponse:', setCookieHeaders);

  // Прокси корректно обработает как одну, так и несколько cookie.
  if (setCookieHeaders) {
    const cookies = Array.isArray(setCookieHeaders)
      ? setCookieHeaders
      : [setCookieHeaders];
    cookies.forEach((cookie) => {
      if (cookie) {
        // devConsoleInfo('Setting cookie:', cookie);
        setCookies(cookie);
        nextResponse.headers.append('Set-Cookie', cookie);
      }
    });
  }

  devConsoleInfo('SSR refresh-token successful');
  return nextResponse;
}
