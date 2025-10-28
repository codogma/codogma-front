'use client';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Button, TabOwnProps, Typography } from '@mui/material';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, {
  memo,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { replaceUrlAndDispatchEvent } from '@/helpers/replaceUrlAndDispatchEvent';

export interface TabProps {
  icon: TabOwnProps['icon'];
  label: string;
  href: string;
}

type NavTabsProps = {
  readonly tabs: TabProps[];
};

export const NavTabs: React.FC<NavTabsProps> = memo(function NavTabs({ tabs }) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const ref = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState<boolean>(false);

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
      replaceUrlAndDispatchEvent(router, href);
    },
    [router],
  );

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
                {tab.href === pathname && (
                  <Tooltip title={t('filterOptions')}>
                    <Button
                      variant='outlined'
                      aria-label='menu'
                      size='small'
                      sx={{
                        minWidth: 25,
                        width: 25,
                        height: 25,
                      }}
                    >
                      <ArrowDropDownIcon />
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
    </div>
  );
});
