'use server';
import { cookies } from 'next/headers';

export async function getAuthToken() {
  const cookieStore = cookies();
  const cookie = cookieStore.get('auth-token');
  return cookie?.value;
}
