'use server';

import { headers } from 'next/headers';

import { devConsoleInfo } from '@/helpers/devConsoleLogs';

export const getAllServerHeaders = async (): Promise<
  Record<string, string>
> => {
  const headerList = headers();
  const headersObj = Object.fromEntries(headerList.entries());

  // Белый список безопасных заголовков для API запросов
  const allowedHeaders = [
    'accept',
    'accept-language',
    'accept-encoding',
    'user-agent',
    'cookie',
    'content-type',
    'referer',
  ];

  const filteredHeaders = Object.fromEntries(
    Object.entries(headersObj)
      .filter(([key, value]) => {
        // Проверяем, что заголовок в белом списке
        if (!allowedHeaders.includes(key.toLowerCase())) {
          return false;
        }

        // Проверяем, что значение валидное
        return !(
          value.trim().length === 0 || // не пустое после trim
          value.includes('\n') || // без переносов строк
          value.includes('\r') || // без возврата каретки
          value.length > 8192
        );
      })
      .map(([key, value]) => [key, value.trim()]), // убираем лишние пробелы
  );

  devConsoleInfo('getAllServerHeaders result:', filteredHeaders);
  return filteredHeaders;
};
