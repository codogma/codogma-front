'use server';

import { headers } from 'next/headers';

import { devConsoleInfo } from '@/helpers/devConsoleLogs';

export const getAllServerHeaders = async (): Promise<
  Record<string, string>
> => {
  const headerList = headers();
  const headersObj = Object.fromEntries(headerList.entries());
  // Фильтрация запрещённых служебных заголовков (безопасность для SSR и Tomcat)
  const forbiddenHeaders = [
    'method',
    'url',
    'protocol',
    'scheme',
    'host',
    'path',
    'status',
    'version',
  ];
  const filteredHeaders = Object.fromEntries(
    Object.entries(headersObj).filter(
      ([key]) => !forbiddenHeaders.includes(key.toLowerCase()),
    ),
  );
  devConsoleInfo('getAllServerHeaders result:', filteredHeaders);
  return filteredHeaders;
};
