'use client';
import SearchIcon from '@mui/icons-material/Search';
import { SxProps, Theme } from '@mui/material';
import Button, { ButtonProps } from '@mui/material/Button';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { useEffect } from 'react';

import { getSearchShortcut, usePlatform } from './PlatformProvider';

type SxItem = Exclude<SxProps<Theme>, readonly unknown[]>;

function normalizeSx(sx?: SxProps<Theme>): readonly SxItem[] {
  if (!sx) return [];
  return Array.isArray(sx) ? (sx as readonly SxItem[]) : [sx as SxItem];
}

export const SearchButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ onClick, sx, ...props }, ref) => {
    const t = useTranslations();
    const platform = usePlatform();
    const shortcut = getSearchShortcut(platform);

    // Обработчик нажатия горячих клавиш
    useEffect(() => {
      const handler = (e: KeyboardEvent) => {
        const isSlash = e.key === '/';
        const modifier = e.ctrlKey || e.metaKey; // ctrl (win/linux) или cmd (mac)

        if (!isSlash || !modifier || e.altKey || e.shiftKey) return;

        // Не перехватываем, если фокус в инпуте/текстовом поле
        const active = document.activeElement as HTMLElement | null;
        if (active) {
          const tag = active.tagName;
          if (
            tag === 'INPUT' ||
            tag === 'TEXTAREA' ||
            tag === 'SELECT' ||
            active.isContentEditable
          ) {
            return;
          }
        }

        e.preventDefault();

        // Кликаем по кнопке, если она доступна
        if (
          ref &&
          typeof ref !== 'function' &&
          ref.current &&
          !ref.current.disabled
        ) {
          ref.current.click();
        }
      };

      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }, [ref]);

    const extraSx = normalizeSx(sx);

    return (
      <Button
        ref={ref}
        onClick={onClick}
        disabled={!onClick}
        aria-labelledby='app-search-label'
        aria-keyshortcuts={shortcut || undefined}
        sx={[
          (theme) => ({
            height: 36,
            width: 170,
            margin: 0,
            paddingLeft: theme.spacing(1.5),
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            position: 'relative',
            color: 'inherit',
            fontSize: theme.typography.pxToRem(14),
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
              transform: 'scale(1.02)',
            },
            '&:active': {
              transform: 'scale(0.98)',
            },
            '&:focus-visible': {
              outline: `3px solid rgba(102, 126, 234, 0.5)`,
              outlineOffset: '2px',
            },
            '& .search-button-label': {
              marginRight: 'auto',
              marginBottom: '1px',
              color: 'inherit',
              opacity: 0.8,
              lineHeight: 1,
              fontWeight: 500,
              transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            },
            '&:hover .search-button-label': {
              opacity: 1,
            },
            '& kbd': {
              fontSize: '0.7rem',
              fontWeight: 600,
              lineHeight: '19px',
              marginLeft: '4px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '0 5px',
              borderRadius: 6,
              color: 'inherit',
              opacity: 0.7,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            },
            '&:hover kbd': {
              opacity: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderColor: 'rgba(255, 255, 255, 0.4)',
            },
            '& svg': {
              fontSize: '1.125rem',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              color: 'inherit',
            },
            '&:hover svg': {
              transform: 'scale(1.05)',
            },
          }),
          ...extraSx,
        ]}
        {...props}
      >
        <SearchIcon
          color='inherit'
          sx={{
            fontSize: '1.125rem',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
        <span id='app-search-label' className='search-button-label'>
          {t('search')}
        </span>
        {shortcut && (
          <kbd
            aria-hidden='true'
            style={{
              all: 'unset',
              fontSize: '0.7rem',
              fontWeight: 600,
              lineHeight: '19px',
              marginLeft: '4px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '0 5px',
              borderRadius: 6,
              color: 'inherit',
              opacity: 0.7,
            }}
          >
            {shortcut}
          </kbd>
        )}
      </Button>
    );
  },
);

SearchButton.displayName = 'SearchButton';
