'use client';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
  Button,
  Menu,
  MenuItem,
  TabOwnProps,
  Typography,
  useTheme,
} from '@mui/material';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, {
  memo,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { NavTooltip } from '@/components/NavTooltip';
import { ArticleSortField, SortOrder } from '@/types';

export interface TabProps {
  icon: TabOwnProps['icon'];
  label: string;
  href: string;
}

type NavTabsProps = {
  readonly tabs: TabProps[];
};

const SORT_OPTIONS = [
  {
    label: 'Новые',
    value: { sort: ArticleSortField.UPDATED_AT, order: SortOrder.DESC },
    lngKey: 'newest',
  },
  {
    label: 'Старые',
    value: { sort: ArticleSortField.UPDATED_AT, order: SortOrder.ASC },
    lngKey: 'oldest',
  },
  {
    label: 'Просмотры',
    value: { sort: ArticleSortField.VIEWS_COUNT, order: SortOrder.DESC },
    lngKey: 'mostViewed',
  },
  {
    label: 'Лайки',
    value: { sort: ArticleSortField.LIKES_COUNT, order: SortOrder.DESC },
    lngKey: 'mostLiked',
  },
];

const NavTabsComponent = ({ tabs }: NavTabsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Проверка: активна ли страница списка статей (не деталка!)
  const isArticlesListingPage = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    return segments.length === 2 && segments[1] === 'articles';
  }, [pathname]);

  // Текущие параметры сортировки из URL
  const currentSort = searchParams.get('sort') || ArticleSortField.UPDATED_AT;
  const currentOrder = searchParams.get('order') || SortOrder.DESC;

  useLayoutEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const listNode = entry.target.querySelector(
          '[role="tablist"]',
        ) as HTMLElement;
        setOverflow(listNode.scrollWidth > listNode.clientWidth);
      }
    });
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  const visible = useMemo(
    () =>
      tabs.some(
        (tab) => pathname?.startsWith(tab.href) && pathname === tab.href,
      ),
    [tabs, pathname],
  );

  const handleClick = useCallback(
    (href: string) => {
      router.push(href, { scroll: false });
    },
    [router],
  );

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSortSelect = (sort: ArticleSortField, order: SortOrder) => {
    handleMenuClose();
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sort);
    params.set('order', order);
    const newPath = `${pathname}?${params.toString()}`;
    router.push(newPath, { scroll: false });
  };

  if (!visible) return null;

  return (
    <div ref={ref} className='nav-tabs paper-texture'>
      <Tabs
        value={pathname}
        variant={overflow ? 'scrollable' : 'standard'}
        scrollButtons={overflow ? 'auto' : false}
        allowScrollButtonsMobile={overflow}
        aria-label='scrollable force tabs example'
        slotProps={{
          indicator: {
            sx: {
              height: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '3px 3px 0 0',
            },
          },
        }}
        sx={{
          minHeight: 48,
          '& .MuiTab-root': {
            fontSize: {
              xs: '0.8125rem',
              lg: '0.875rem',
            },
            fontWeight: 500,
          },
          '& .MuiTabs-scrollButtons': {
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              background:
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.04)',
            },
            '&.Mui-disabled': {
              opacity: 0.3,
            },
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.href}
            icon={tab.icon}
            iconPosition='start'
            component={Link}
            href={tab.href}
            label={
              <Typography
                sx={{
                  display: 'flex',
                  gap: '.5rem',
                  alignItems: 'center',
                }}
              >
                {tab.label}
                {tab.href === pathname && isArticlesListingPage && (
                  <NavTooltip title={t('filterOptions')}>
                    <Button
                      id='basic-button'
                      aria-controls={open ? 'basic-menu' : undefined}
                      aria-haspopup='true'
                      aria-expanded={open ? 'true' : undefined}
                      variant='outlined'
                      aria-label='menu'
                      size='small'
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        handleMenuClick(event);
                      }}
                      sx={{
                        minWidth: 28,
                        width: 28,
                        height: 28,
                        ml: 0.5,
                        borderRadius: '10px',
                        p: 0.5,
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          backgroundColor:
                            theme.palette.mode === 'dark'
                              ? 'rgba(255, 255, 255, 0.1)'
                              : 'rgba(0, 0, 0, 0.05)',
                          transform: 'scale(1.08)',
                          borderColor:
                            theme.palette.mode === 'dark'
                              ? 'rgba(255, 255, 255, 0.35)'
                              : 'rgba(0, 0, 0, 0.2)',
                        },
                        '&:active': {
                          transform: 'scale(0.96)',
                        },
                        '& .MuiSvgIcon-root': {
                          fontSize: 20,
                          transition:
                            'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        },
                        '&:hover .MuiSvgIcon-root': {
                          transform: 'scale(1.12)',
                        },
                      }}
                    >
                      <ArrowDropDownIcon
                        sx={{
                          transform: open ? 'rotate(180deg)' : 'none',
                          transition:
                            'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      />
                    </Button>
                  </NavTooltip>
                )}
              </Typography>
            }
            value={tab.href}
            onMouseEnter={() => router.prefetch(tab.href)}
            onClick={() => handleClick(tab.href)}
            scroll={false}
            sx={(theme) => ({
              minHeight: 48,
              textTransform: 'none',
              borderRadius: '14px 14px 0 0',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              margin: '0 2px',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: '100%',
                height: '3px',
                opacity: 0,
                transition: 'opacity 0.3s ease',
              },
              '&:hover': {
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(138, 180, 248, 0.12)'
                    : 'rgba(102, 126, 234, 0.08)',
                transform: 'translateY(-2px)',
                '& .MuiTab-iconWrapper': {
                  transform: 'scale(1.12) rotate(2deg)',
                },
                color: theme.palette.mode === 'dark' ? '#8ab4f8' : '#1a73e8',
              },
              '&.Mui-selected': {
                color: theme.palette.mode === 'dark' ? '#8ab4f8' : '#1a73e8',
                fontWeight: 700,
                '& .MuiTab-iconWrapper': {
                  color: theme.palette.mode === 'dark' ? '#8ab4f8' : '#1a73e8',
                },
                '&::before': {
                  opacity: 1,
                },
              },
              '&.Mui-focusVisible': {
                outline: `2px solid ${
                  theme.palette.mode === 'dark' ? '#8ab4f8' : '#1a73e8'
                }`,
                outlineOffset: '2px',
              },
              '& .MuiTab-iconWrapper': {
                transition:
                  'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s ease, background 0.3s ease',
                marginRight: theme.spacing(1),
              },
            })}
          />
        ))}
      </Tabs>

      {isArticlesListingPage && (
        <Menu
          id='basic-menu'
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          slotProps={{
            list: { 'aria-labelledby': 'basic-button' },
            paper: {
              sx: {
                borderRadius: '18px',
                border: (theme) =>
                  theme.palette.mode === 'dark'
                    ? '1px solid rgba(255, 255, 255, 0.1)'
                    : '1px solid rgba(0, 0, 0, 0.06)',
                backdropFilter: 'blur(20px) saturate(180%)',
                boxShadow: (theme) =>
                  theme.palette.mode === 'dark'
                    ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)'
                    : '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
                mt: 1,
                '& .MuiMenuItem-root': {
                  borderRadius: '10px',
                  mx: 1,
                  my: 0.5,
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background:
                      theme.palette.mode === 'dark'
                        ? 'rgba(138, 180, 248, 0.15)'
                        : 'rgba(102, 126, 234, 0.1)',
                    transform: 'translateX(3px)',
                  },
                  '&.Mui-selected': {
                    background:
                      theme.palette.mode === 'dark'
                        ? 'rgba(138, 180, 248, 0.2)'
                        : 'rgba(102, 126, 234, 0.15)',
                    fontWeight: 700,
                    color:
                      theme.palette.mode === 'dark' ? '#8ab4f8' : '#1a73e8',
                  },
                },
              },
            },
          }}
        >
          {SORT_OPTIONS.map((option) => (
            <MenuItem
              key={`${option.value.sort}-${option.value.order}`}
              onClick={() =>
                handleSortSelect(option.value.sort, option.value.order)
              }
              selected={
                currentSort === option.value.sort &&
                currentOrder === option.value.order
              }
              sx={{
                fontWeight:
                  currentSort === option.value.sort &&
                  currentOrder === option.value.order
                    ? 'bold'
                    : 'normal',
              }}
            >
              {t(`articlesPage.sort.${option.lngKey}`) || option.label}
            </MenuItem>
          ))}
        </Menu>
      )}
    </div>
  );
};

export const NavTabs = memo(NavTabsComponent);
