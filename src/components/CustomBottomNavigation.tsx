'use client';
import ArticleIcon from '@mui/icons-material/Article';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import ViewListIcon from '@mui/icons-material/ViewList';
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper,
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { replaceUrlAndDispatchEvent } from '@/helpers/replaceUrlAndDispatchEvent';
import { Language } from '@/types';

type CustomBottomNavigationProps = {
  readonly lang: Language;
};

export const CustomBottomNavigation = ({
  lang,
}: CustomBottomNavigationProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState<
    'articles' | 'feed' | 'compilations' | undefined
  >();
  const t = useTranslations();

  const handleChange = (
    _event: React.SyntheticEvent,
    newValue: 'articles' | 'feed' | 'compilations',
  ) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (pathname === `/${lang}/articles`) {
      setValue('articles');
    } else if (pathname === `/${lang}/feed`) {
      setValue('feed');
    } else if (pathname === `/${lang}/compilations`) {
      setValue('compilations');
    } else if (pathname === `/${lang}`) {
      setValue(undefined);
    }
  }, [lang, pathname]);

  const items = [
    { value: 'articles', href: `/${lang}/articles`, icon: <ArticleIcon /> },
    {
      value: 'feed',
      href: `/${lang}/feed`,
      icon: <PlaylistAddCheckCircleIcon />,
    },
    {
      value: 'compilations',
      href: `/${lang}/compilations`,
      icon: <ViewListIcon />,
    },
  ];

  const handleClick = (href: string) => {
    replaceUrlAndDispatchEvent(router, href);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 'auto',
        bottom: 0,
        left: 0,
        right: 0,
        display: { xs: 'block', md: 'none' },
        zIndex: 1200,
        px: 2,
        pb: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={(theme) => ({
          borderRadius: '24px',
          background:
            theme.palette.mode === 'dark'
              ? 'rgba(30, 30, 30, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)'
              : '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            background:
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.05) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.02) 100%)',
            pointerEvents: 'none',
          },
        })}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={handleChange}
          sx={(theme) => ({
            minHeight: 64,
            py: 1,
            '& .MuiBottomNavigationAction-root': {
              minWidth: 0,
              flex: 1,
              py: 1.5,
              px: 1,
              borderRadius: '16px',
              mx: 0.5,
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(138, 180, 248, 0.08) 0%, rgba(197, 134, 249, 0.08) 100%)'
                    : 'linear-gradient(135deg, rgba(102, 126, 234, 0.06) 0%, rgba(118, 75, 162, 0.06) 100%)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                zIndex: 0,
              },
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow:
                  theme.palette.mode === 'dark'
                    ? '0 6px 16px rgba(138, 180, 248, 0.25)'
                    : '0 6px 16px rgba(102, 126, 234, 0.2)',
                '&::before': {
                  opacity: 1,
                },
                '& .MuiBottomNavigationAction-label': {
                  color:
                    theme.palette.mode === 'dark' ? '#8ab4f8' : '#1a73e8',
                  fontWeight: 600,
                },
                '& .nav-icon-wrapper': {
                  transform: 'scale(1.12)',
                  background:
                    theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, rgba(138, 180, 248, 0.25) 0%, rgba(197, 134, 249, 0.25) 100%)'
                      : 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
                  boxShadow:
                    theme.palette.mode === 'dark'
                      ? 'inset 0 2px 4px rgba(255, 255, 255, 0.1)'
                      : 'inset 0 2px 4px rgba(255, 255, 255, 0.3)',
                },
              },
              '&.Mui-selected': {
                '& .nav-icon-wrapper': {
                  background:
                    theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #8ab4f8 0%, #c58af9 100%)'
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  transform: 'scale(1.1)',
                  boxShadow:
                    theme.palette.mode === 'dark'
                      ? '0 4px 12px rgba(138, 180, 248, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                      : '0 4px 12px rgba(102, 126, 234, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                },
                '& .MuiBottomNavigationAction-label': {
                  color:
                    theme.palette.mode === 'dark' ? '#8ab4f8' : '#1a73e8',
                  fontWeight: 700,
                },
              },
              '&:active': {
                transform: 'scale(0.96)',
              },
            },
          })}
        >
          {items.map(({ value, href, icon }) => (
            <BottomNavigationAction
              key={value}
              label={t(value)}
              value={value}
              icon={
                <Box
                  className='nav-icon-wrapper'
                  sx={(theme) => ({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 50,
                    height: 50,
                    borderRadius: '16px',
                    background:
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(255, 255, 255, 0.6)',
                    border: (theme) =>
                      theme.palette.mode === 'dark'
                        ? '1px solid rgba(255, 255, 255, 0.15)'
                        : '1px solid rgba(0, 0, 0, 0.06)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    zIndex: 1,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 'inherit',
                      background:
                        theme.palette.mode === 'dark'
                          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 50%)'
                          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 50%)',
                      pointerEvents: 'none',
                    },
                    '& svg': {
                      fontSize: 24,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      zIndex: 2,
                    },
                  })}
                >
                  {icon}
                </Box>
              }
              onClick={() => handleClick(href)}
              sx={{
                minWidth: 0,
                flex: 1,
              }}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
};
