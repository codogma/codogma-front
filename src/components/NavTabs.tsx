'use client';
import Tab from '@mui/material/Tab';
import { TabOwnProps } from '@mui/material/Tab/Tab';
import Tabs from '@mui/material/Tabs';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  const [value, setValue] = useState<string>(pathname);
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
      setValue(href);
      replaceUrlAndDispatchEvent(router, href);
    },
    [router],
  );

  if (!visible) return null;

  return (
    <div ref={ref} className='nav-tabs'>
      <Tabs
        value={value}
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
            label={tab.label}
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
