'use server';

import { cookies } from 'next/headers';

export const getAuthToken = async (): Promise<string> => {
  const cookieStore = cookies();
  return String(cookieStore.get('auth-token')?.value);
};
