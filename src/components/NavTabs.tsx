'use client';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Button, Menu, MenuItem, TabOwnProps, Typography } from '@mui/material';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
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

export const NavTabs: React.FC<NavTabsProps> = memo(function NavTabs({ tabs }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const ref = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Проверка: активна ли страница списка статей (не деталка!)
  const isArticlesListingPage = useMemo(() => {
    // Проверяем: /ru/articles но не /ru/articles/123
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

  // Обработчики меню сортировки
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSortSelect = (sort: ArticleSortField, order: SortOrder) => {
    handleMenuClose();

    // Формируем новые параметры, сохраняя поиск
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sort);
    params.set('order', order);

    // Обновляем URL без перезагрузки
    const newPath = `${pathname}?${params.toString()}`;
    router.push(newPath, { scroll: false });
  };

  if (!visible) return null;

  return (
    <div ref={ref} className='nav-tabs'>
      <Tabs
        value={pathname}
        variant={overflow ? 'scrollable' : 'standard'}
        scrollButtons={overflow ? 'auto' : false}
        allowScrollButtonsMobile={overflow}
        aria-label='scrollable force tabs example'
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
                }}
              >
                {tab.label}
                {/* Условный рендер кнопки фильтра ТОЛЬКО для списка статей */}
                {tab.href === pathname && isArticlesListingPage && (
                  <Tooltip title={t('filterOptions')}>
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
                        minWidth: 25,
                        width: 25,
                        height: 25,
                        ml: 0.5,
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <ArrowDropDownIcon
                        sx={{
                          transform: open ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.2s',
                        }}
                      />
                    </Button>
                  </Tooltip>
                )}
              </Typography>
            }
            value={tab.href}
            onMouseEnter={() => router.prefetch(tab.href)}
            onClick={() => handleClick(tab.href)}
            scroll={false}
            sx={{ minHeight: '48px', textTransform: 'none' }}
          />
        ))}
      </Tabs>

      {/* Меню сортировки (рендерится только для списка статей) */}
      {isArticlesListingPage && (
        <Menu
          id='basic-menu'
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
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
});
