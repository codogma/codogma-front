'use server';

import { headers } from 'next/headers';

// import { devConsoleInfo } from '@/helpers/devConsoleLogs';

export const getAllServerHeaders = async (): Promise<
  Record<string, string>
> => {
  const headerList = headers();
  const headersObj = Object.fromEntries(headerList.entries());
  // devConsoleInfo('getAllServerHeaders result:', headersObj);
  return headersObj;
};
