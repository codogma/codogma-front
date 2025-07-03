'use client';
import ClassIcon from '@mui/icons-material/Class';
import ViewListIcon from '@mui/icons-material/ViewList';
import { useTranslations } from 'next-intl';
import React, { ReactNode } from 'react';

import { MyCompilationsBadge } from '@/components/MyCompilationsBadge';
import { NavTabs, TabProps } from '@/components/NavTabs';
import { Language } from '@/types';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: { lng: Language };
};

export default function Layout({ params: { lng }, children }: LayoutProps) {
  const t = useTranslations();
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
