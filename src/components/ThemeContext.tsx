'use client';
import { CssBaseline } from '@mui/material';
import { defaultConfig } from '@mui/material/InitColorSchemeScript/InitColorSchemeScript';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react';

import { Scrollbar } from '@/components/Scrollbar';

const theme = createTheme({
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: 'class',
  },
});

type ColorModeProviderProps = {
  readonly children: ReactNode;
};

export const ColorModeProvider = ({ children }: ColorModeProviderProps) => {
  const pathname = usePathname();
  return (
    <ThemeProvider
      theme={theme}
      defaultMode={defaultConfig.defaultDarkColorScheme}
    >
      <CssBaseline />
      <Scrollbar scrollKey={pathname} resetOnRouteChange={true}>
        {children}
      </Scrollbar>
    </ThemeProvider>
  );
};
