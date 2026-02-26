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
          borderRadius: '20px',
          background:
            theme.palette.mode === 'dark'
              ? 'rgba(30, 30, 30, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.3)'}`,
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)'
              : '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        })}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={handleChange}
          sx={{
            minHeight: 64,
            py: 1,
            '& .MuiBottomNavigationAction-root': {
              minWidth: 0,
              flex: 1,
              py: 1.5,
              px: 1,
              borderRadius: '14px',
              mx: 0.5,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
                  'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                zIndex: 0,
              },
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: (theme) =>
                  theme.palette.mode === 'dark'
                    ? '0 8px 20px rgba(102, 126, 234, 0.3)'
                    : '0 8px 20px rgba(102, 126, 234, 0.2)',
                '&::before': {
                  opacity: 1,
                },
                '& .MuiBottomNavigationAction-label': {
                  color: (theme) =>
                    theme.palette.mode === 'dark' ? '#8ab4f8' : '#1a73e8',
                  fontWeight: 600,
                },
                '& .nav-icon-wrapper': {
                  transform: 'scale(1.15)',
                  background: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)'
                      : 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
                },
              },
              '&.Mui-selected': {
                '& .nav-icon-wrapper': {
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  transform: 'scale(1.1)',
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 4px 15px rgba(102, 126, 234, 0.5)'
                      : '0 4px 15px rgba(102, 126, 234, 0.4)',
                },
                '& .MuiBottomNavigationAction-label': {
                  color: (theme) =>
                    theme.palette.mode === 'dark' ? '#8ab4f8' : '#1a73e8',
                  fontWeight: 700,
                },
              },
              '&:active': {
                transform: 'scale(0.95)',
              },
            },
          }}
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
                    width: 48,
                    height: 48,
                    borderRadius: '14px',
                    background:
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(255, 255, 255, 0.5)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    zIndex: 1,
                    '& svg': {
                      fontSize: 24,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
