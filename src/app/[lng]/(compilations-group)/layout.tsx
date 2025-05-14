'use client';
import ClassIcon from '@mui/icons-material/Class';
import ViewListIcon from '@mui/icons-material/ViewList';
import React, { ReactNode } from 'react';

import { useT } from '@/app/i18n/client';
import { MyCompilationsBadge } from '@/components/MyCompilationsBadge';
import { NavTabs, TabProps } from '@/components/NavTabs';
import { Language } from '@/types';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: { lng: Language };
};

function Layout({ params: { lng }, children }: LayoutProps) {
  const { t } = useT();
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
