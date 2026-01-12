'use client';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { SxProps, Theme } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { useColorScheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Cookies from 'js-cookie';
import React, { FC, useState } from 'react';

import { themeConfig } from '@/constants/theme-config';
import { ThemeProviderProps } from '@/types';

interface ThemeToggleButtonProps {
  readonly sx?: SxProps<Theme>;
  readonly title?: string;
  readonly theme: ThemeProviderProps['defaultMode'];
}

export const ThemeToggleButton: FC<ThemeToggleButtonProps> = ({
  sx,
  title,
  theme,
}) => {
  const { mode, setMode } = useColorScheme();
  const [themeMode, setThemeMode] =
    useState<ThemeProviderProps['defaultMode']>(theme);

  const handleToggleTheme = () => {
    const newMode =
      mode === themeConfig.defaultLightColorScheme
        ? themeConfig.defaultDarkColorScheme
        : themeConfig.defaultLightColorScheme;
    setMode(newMode);
    setThemeMode(newMode);
    Cookies.set(themeConfig.modeStorageKey, newMode);
  };

  return (
    <Tooltip title={title}>
      <Checkbox
        checked={themeMode === 'dark'}
        onChange={handleToggleTheme}
        icon={<Brightness7Icon />}
        checkedIcon={<Brightness4Icon />}
        slotProps={{ input: { 'aria-label': 'Like' } }}
        sx={{
          color: 'inherit',
          '&.Mui-checked': {
            color: 'inherit',
          },
          ...sx,
        }}
      />
    </Tooltip>
  );
};
