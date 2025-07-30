'use server';

import { headers } from 'next/headers';

export const getAllServerHeaders = async (): Promise<
  Record<string, string>
> => {
  const headerList = headers();
  return Object.fromEntries(headerList.entries());
};
