'use client';
import ArticleIcon from '@mui/icons-material/Article';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import ViewListIcon from '@mui/icons-material/ViewList';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { replaceUrlAndDispatchEvent } from '@/helpers/replaceUrlAndDispatchEvent';
import { Language } from '@/types';

type NavPanelProps = {
  readonly lang: Language;
};

export const NavPanel = ({ lang }: NavPanelProps) => {
  const pathname = usePathname();
  const theme = useTheme();
  const isMin = useMediaQuery(theme.breakpoints.down('lg'));
  const t = useTranslations();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (pathname.startsWith(`/${lang}/articles`)) {
      setActiveIndex(0);
    } else if (pathname.startsWith(`/${lang}/feed`)) {
      setActiveIndex(1);
    } else if (pathname.startsWith(`/${lang}/compilations`)) {
      setActiveIndex(2);
    } else if (pathname.startsWith(`/${lang}`)) {
      setActiveIndex(undefined);
    }
  }, [lang, pathname]);

  const items = [
    { text: t('articles'), href: `/${lang}/articles`, icon: <ArticleIcon /> },
    {
      text: t('feed'),
      href: `/${lang}/feed`,
      icon: <PlaylistAddCheckCircleIcon />,
    },
    {
      text: t('compilations'),
      href: `/${lang}/compilations`,
      icon: <ViewListIcon />,
    },
  ];

  const handleClick = (href: string) => {
    replaceUrlAndDispatchEvent(router, href);
  };

  return (
    <Box component='nav'>
      <Drawer
        variant='permanent'
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            position: 'relative',
            height: { xs: 0, md: '100vh' },
            background: 'var(--mui-palette-background-paper)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          },
        }}
      >
        <List sx={{ overflow: 'hidden', py: 2 }}>
          {items.map(({ text, href, icon }, index) => (
            <ListItem
              key={text}
              disablePadding
              sx={{ display: 'block', mb: 1 }}
            >
              <Tooltip
                title={text}
                arrow
                placement='right'
                sx={{ display: { sm: 'block', xl: 'none' } }}
                disableHoverListener={!isMin}
                slotProps={{
                  popper: {
                    modifiers: [
                      { name: 'offset', options: { offset: [0, -8] } },
                    ],
                  },
                  tooltip: {
                    sx: {
                      backgroundColor: 'rgba(31, 34, 37, 0.95)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: '10px',
                      px: 1.5,
                      py: 0.75,
                      fontSize: '0.875rem',
                      border: (theme) =>
                        theme.palette.mode === 'dark'
                          ? '1px solid rgba(255, 255, 255, 0.1)'
                          : '1px solid rgba(0, 0, 0, 0.08)',
                      boxShadow: (theme) =>
                        theme.palette.mode === 'dark'
                          ? '0 4px 20px rgba(0, 0, 0, 0.4)'
                          : '0 4px 20px rgba(0, 0, 0, 0.12)',
                    },
                  },
                }}
              >
                <Link href={href} scroll={false}>
                  <ListItemButton
                    sx={(theme) => ({
                      flexDirection: { xs: 'column', lg: 'row' },
                      display: 'flex',
                      alignItems: { xs: 'center', lg: 'left' },
                      justifyItems: { xs: 'center', lg: 'left' },
                      borderRadius: '14px',
                      mx: 1,
                      py: 1.5,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      border:
                        activeIndex === index
                          ? theme.palette.mode === 'dark'
                            ? '1px solid rgba(138, 180, 248, 0.3)'
                            : '1px solid rgba(102, 126, 234, 0.2)'
                          : '1px solid transparent',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '4px',
                        height: '100%',
                        background:
                          'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      },
                      '&:hover': {
                        background:
                          theme.palette.mode === 'dark'
                            ? 'rgba(138, 180, 248, 0.12)'
                            : 'rgba(102, 126, 234, 0.08)',
                        transform: 'translateX(3px)',
                        border:
                          theme.palette.mode === 'dark'
                            ? '1px solid rgba(138, 180, 248, 0.4)'
                            : '1px solid rgba(102, 126, 234, 0.3)',
                        '&::before': {
                          opacity: 1,
                        },
                        '& .nav-icon': {
                          transform: 'scale(1.12) rotate(3deg)',
                          background:
                            theme.palette.mode === 'dark'
                              ? 'rgba(138, 180, 248, 0.2)'
                              : 'rgba(102, 126, 234, 0.15)',
                        },
                        '& .nav-text': {
                          color:
                            theme.palette.mode === 'dark'
                              ? '#8ab4f8'
                              : '#1a73e8',
                          fontWeight: 600,
                        },
                      },
                      '&.Mui-selected': {
                        background:
                          theme.palette.mode === 'dark'
                            ? 'rgba(138, 180, 248, 0.18)'
                            : 'rgba(102, 126, 234, 0.12)',
                        border:
                          theme.palette.mode === 'dark'
                            ? '1px solid rgba(138, 180, 248, 0.4)'
                            : '1px solid rgba(102, 126, 234, 0.3)',
                        '&::before': {
                          opacity: 1,
                        },
                        '& .nav-icon': {
                          background:
                            theme.palette.mode === 'dark'
                              ? 'rgba(138, 180, 248, 0.25)'
                              : 'rgba(102, 126, 234, 0.2)',
                        },
                        '& .nav-text': {
                          fontWeight: 700,
                          color:
                            theme.palette.mode === 'dark'
                              ? '#8ab4f8'
                              : '#1a73e8',
                        },
                      },
                      '&:active': {
                        transform: 'scale(0.98)',
                      },
                    })}
                    onClick={() => {
                      handleClick(href);
                      setActiveIndex(index);
                    }}
                    selected={activeIndex === index}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: { xs: 0, lg: 2 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Box
                        className='nav-icon'
                        sx={(theme) => ({
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 42,
                          height: 42,
                          borderRadius: '12px',
                          background:
                            activeIndex === index
                              ? theme.palette.mode === 'dark'
                                ? 'rgba(138, 180, 248, 0.2)'
                                : 'rgba(102, 126, 234, 0.15)'
                              : theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.06)'
                                : 'rgba(0, 0, 0, 0.04)',
                          border:
                            activeIndex === index
                              ? theme.palette.mode === 'dark'
                                ? '1px solid rgba(138, 180, 248, 0.2)'
                                : '1px solid rgba(102, 126, 234, 0.15)'
                              : '1px solid transparent',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '& svg': {
                            fontSize: 22,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          },
                        })}
                      >
                        {icon}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      className='nav-text'
                      sx={{
                        '& .MuiTypography-root': {
                          fontSize: {
                            xs: '0.875rem',
                            lg: '1.1rem',
                          },
                          fontWeight: activeIndex === index ? 700 : 500,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          color:
                            activeIndex === index
                              ? (theme) =>
                                  theme.palette.mode === 'dark'
                                    ? '#8ab4f8'
                                    : '#1a73e8'
                              : 'text.primary',
                        },
                      }}
                    />
                  </ListItemButton>
                </Link>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};
