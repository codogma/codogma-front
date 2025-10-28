'use server';

import { defaultConfig } from '@mui/material/InitColorSchemeScript/InitColorSchemeScript';
import { ThemeProviderProps } from '@mui/material/styles/ThemeProvider';
import { cookies } from 'next/headers';

export const getTheme = async (): Promise<
  ThemeProviderProps['defaultMode']
> => {
  return cookies().get(defaultConfig.modeStorageKey)
    ?.value as ThemeProviderProps['defaultMode'];
};
