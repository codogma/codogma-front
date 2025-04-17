'use client';
import ClassIcon from '@mui/icons-material/Class';
import ViewListIcon from '@mui/icons-material/ViewList';
import React, { ReactNode } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { MyCompilationsBadge } from '@/components/MyCompilationsBadge';
import NavTabs, { TabProps } from '@/components/NavTabs';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: { lng: string };
};

function Layout({ params: { lng }, children }: LayoutProps) {
  const { t } = useTranslation(lng);
  const tabs: TabProps[] = [
    {
      icon: <ViewListIcon />,
      label: `${t('compilations')}`,
      href: `/${lng}/compilations`,
    },
    {
      icon: <ClassIcon />,
      label: `${t('bookmarks')}`,
      href: `/${lng}/bookmarks`,
    },
    {
      icon: <MyCompilationsBadge />,
      label: `${t('myCompilations')}`,
      href: `/${lng}/my-compilations`,
    },
  ];
  return (
    <>
      <NavTabs tabs={tabs} />
      {children}
    </>
  );
}

export default Layout;
