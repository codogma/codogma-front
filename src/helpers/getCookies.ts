'use server';

import { cookies } from 'next/headers';

export const getAuthToken = async (): Promise<string | undefined> => {
  const cookieStore = await cookies();
  return cookieStore.get('auth-token')?.value;
};

export const getIntl = async (): Promise<string | undefined> => {
  const cookieStore = await cookies();
  return cookieStore.get('intl')?.value;
};
