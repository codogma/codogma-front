'use client';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export interface TabProps {
  label: string;
  href: string;
}

type NavTabsProps = {
  tabs: TabProps[];
};

const NavTabs: React.FC<NavTabsProps> = ({ tabs }) => {
  const pathname = usePathname();

  const shouldShowNavTabs = tabs.some((tab) => {
    const basePath = tab.href;
    return pathname?.startsWith(basePath) && pathname === basePath;
  });

  if (!shouldShowNavTabs) return null;

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
          />
        ))}
      </Tabs>
    </div>
  );
};

export default NavTabs;
