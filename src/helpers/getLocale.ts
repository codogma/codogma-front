'use server';

import { headers } from 'next/headers';

import { headerName } from '@/constants/i18n';
import { Language } from '@/types';

export const getLocale = async (): Promise<Language> => {
  const headerList = await headers();
  return headerList.get(headerName) as Language;
};
