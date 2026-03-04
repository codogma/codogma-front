'use client';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { SxProps, Theme } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { useColorScheme } from '@mui/material/styles';
import Cookies from 'js-cookie';
import React, { FC, useState } from 'react';

import { NavTooltip } from '@/components/NavTooltip';
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
    <NavTooltip title={title} arrow>
      <Checkbox
        checked={themeMode === 'dark'}
        onChange={handleToggleTheme}
        icon={
          <Brightness7Icon
            sx={{
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              fontSize: 24,
            }}
          />
        }
        checkedIcon={
          <Brightness4Icon
            sx={{
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              fontSize: 24,
              color: '#667eea',
            }}
          />
        }
        slotProps={{ input: { 'aria-label': 'Like' } }}
        sx={{
          color: 'inherit',
          borderRadius: '10px',
          p: 0.75,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            transform: 'scale(1.1)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
          '&.Mui-checked': {
            color: 'inherit',
          },
          ...sx,
        }}
      />
    </NavTooltip>
  );
};
