'use client';
import Tab from '@mui/material/Tab';
import { TabOwnProps } from '@mui/material/Tab/Tab';
import Tabs from '@mui/material/Tabs';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

import { replaceUrlAndDispatchEvent } from '@/helpers/replaceUrlAndDispatchEvent';

export interface TabProps {
  icon: TabOwnProps['icon'];
  label: string;
  href: string;
}

type NavTabsProps = {
  readonly tabs: TabProps[];
};

const NavTabs: React.FC<NavTabsProps> = ({ tabs }) => {
  const router = useRouter();
  const pathname = usePathname();

  const shouldShowNavTabs = tabs.some((tab) => {
    const basePath = tab.href;
    return pathname?.startsWith(basePath) && pathname === basePath;
  });

  if (!shouldShowNavTabs) return null;

  const handleClick = (href: string) => {
    replaceUrlAndDispatchEvent(router, href);
  };

  return (
    <div className='nav-tabs'>
      <Tabs
        value={pathname}
        variant='scrollable'
        scrollButtons
        allowScrollButtonsMobile
        aria-label='scrollable force tabs example'
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            icon={tab.icon}
            iconPosition='start'
            component={Link}
            href={tab.href}
            label={tab.label}
            value={tab.href}
            onClick={() => handleClick(tab.href)}
            scroll={false}
            sx={{ minHeight: 'auto', textTransform: 'none' }}
          />
        ))}
      </Tabs>
    </div>
  );
};

export default NavTabs;
