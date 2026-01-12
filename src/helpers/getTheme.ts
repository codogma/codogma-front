'use server';

import { cookies } from 'next/headers';

import { themeConfig } from '@/constants/theme-config';
import { ThemeProviderProps } from '@/types';

export const getTheme = async (): Promise<
  ThemeProviderProps['defaultMode']
> => {
  return (await cookies()).get(themeConfig.modeStorageKey)
    ?.value as ThemeProviderProps['defaultMode'];
};
