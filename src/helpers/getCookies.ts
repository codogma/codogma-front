'use server';

import { cookies } from 'next/headers';

import { Language } from '@/types';

export const getAuthToken = async (): Promise<string> => {
  const cookieStore = await cookies();
  return String(cookieStore.get('auth-token')?.value);
};

export const getIntl = async (): Promise<Language> => {
  const cookieStore = await cookies();
  return Language[cookieStore.get('intl')?.value as keyof typeof Language];
};
