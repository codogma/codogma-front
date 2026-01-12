'use server';

import { cookies } from 'next/headers';

// import { devConsoleInfo } from '@/helpers/devConsoleLogs';
import { devConsoleWarn } from '@/helpers/devConsoleLogs';

/**
 * Принимает строку Set-Cookie как из заголовка ответа и парсит все опции,
 * далее передаёт объект в cookies().set(...)
 */
export const setCookies = async (cookieStr: string): Promise<void> => {
  const [pair, ...attributes] = cookieStr.split(';').map((s) => s.trim());
  const [name, ...v] = pair.split('=');
  const value = v.join('=');

  // const options: Record<string, string | true> = {};
  // for (const attr of attributes) {
  //   if (!attr) continue;
  //   const [k, ...val] = attr.split('=');
  //   options[k.toLowerCase()] = val.length ? val.join('=') : true;
  // }

  // cookies().set({ name, value, ...options });

  // Правильная типизация опций для Next.js cookies
  const options: {
    domain?: string;
    expires?: Date;
    httpOnly?: boolean;
    maxAge?: number;
    path?: string;
    priority?: 'low' | 'medium' | 'high';
    sameSite?: 'strict' | 'lax' | 'none';
    secure?: boolean;
  } = {};

  for (const attr of attributes) {
    if (!attr) continue;
    const [k, ...val] = attr.split('=');
    const key = k.toLowerCase();
    const attrValue = val.length ? val.join('=') : '';

    switch (key) {
      case 'domain':
        options.domain = attrValue;
        break;
      case 'path':
        options.path = attrValue;
        break;
      case 'expires':
        // Парсим дату из строки
        options.expires = new Date(attrValue);
        break;
      case 'max-age':
        // Преобразуем в число
        options.maxAge = parseInt(attrValue, 10);
        break;
      case 'samesite':
        // Приводим к правильному типу
        {
          const sameSite = attrValue.toLowerCase();
          if (
            sameSite === 'strict' ||
            sameSite === 'lax' ||
            sameSite === 'none'
          ) {
            options.sameSite = sameSite;
          }
        }
        break;
      case 'secure':
        options.secure = true;
        break;
      case 'httponly':
        options.httpOnly = true;
        break;
      case 'priority':
        {
          const priority = attrValue.toLowerCase();
          if (
            priority === 'low' ||
            priority === 'medium' ||
            priority === 'high'
          ) {
            options.priority = priority;
          }
        }
        break;
    }
  }

  const cookieStore = await cookies();

  try {
    // devConsoleInfo('Setting cookie with options:', { name, value, options });
    cookieStore.set(name, value, options);
    // devConsoleInfo('Cookie set successfully:', name);
  } catch (error) {
    devConsoleWarn('Error setting cookie:', error);
    // Fallback: setting cookie with name and value
    try {
      cookieStore.set(name, value);
      // devConsoleInfo('Cookie set with fallback (name/value only):', name);
    } catch (fallbackError) {
      devConsoleWarn('Error setting cookie with fallback:', fallbackError);
    }
  }
};
