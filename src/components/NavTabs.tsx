'use client';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

import { replaceUrlAndDispatchEvent } from '@/helpers/replaceUrlAndDispatchEvent';

export interface TabProps {
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
      <Tabs value={pathname} className='tabs'>
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            component={Link}
            href={tab.href}
            label={tab.label}
            value={tab.href}
            onClick={() => handleClick(tab.href)}
          />
        ))}
      </Tabs>
    </div>
  );
};

export default NavTabs;
