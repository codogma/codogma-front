'use client';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { CssBaseline } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Scrollbar } from '@/components/Scrollbar';

const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const ColorModeProvider = ({
  children,
}: {
  readonly children: ReactNode;
}) => {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme-mode') === 'dark' ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
        cssVariables: true,
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Scrollbar>{children}</Scrollbar>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export const useColorMode = () => useContext(ColorModeContext);

interface ThemeToggleButtonProps {
  readonly sx?: object;
  readonly title?: string;
}

export const ThemeToggleButton: FC<ThemeToggleButtonProps> = ({
  sx,
  title,
}) => {
  const theme = useTheme();
  const colorMode = useColorMode();

  return (
    <Tooltip title={title}>
      <IconButton sx={sx} color='inherit' onClick={colorMode.toggleColorMode}>
        {theme.palette.mode === 'dark' ? (
          <Brightness7Icon />
        ) : (
          <Brightness4Icon />
        )}
      </IconButton>
    </Tooltip>
  );
};
