'use server';

import { headers } from 'next/headers';

import { devConsoleInfo } from '@/helpers/devConsoleLogs';

export const getAllServerHeaders = async (): Promise<
  Record<string, string>
> => {
  // headers() в Next возвращает Headers-подобный объект
  const headerList = await headers();
  const headersObj = Object.fromEntries(headerList.entries());

  // Белый список безопасных заголовков для API запросов
  const allowedHeaders = new Set([
    'accept',
    'accept-language',
    'accept-encoding',
    'user-agent',
    'cookie',
    'content-type',
    'referer',
  ]);

  const filteredHeaders: Record<string, string> = {};

  for (const [key, value] of Object.entries(headersObj)) {
    const k = key.toLowerCase();
    if (!allowedHeaders.has(k)) continue;

    if (typeof value !== 'string') continue;

    const v = value.trim();
    if (v.length === 0) continue;
    if (v.includes('\n') || v.includes('\r')) continue;
    if (v.length > 8192) continue;

    filteredHeaders[key] = v;
  }

  devConsoleInfo('getAllServerHeaders result:', filteredHeaders);
  return filteredHeaders;
};
