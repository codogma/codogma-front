'use client';
import ClassIcon from '@mui/icons-material/Class';
import ViewListIcon from '@mui/icons-material/ViewList';
import { useTranslations } from 'next-intl';
import React, { ReactNode, use } from 'react';

import { MyCompilationsBadge } from '@/components/MyCompilationsBadge';
import { NavTabs, TabProps } from '@/components/NavTabs';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: Promise<{ lng: string }>;
};

export default function Layout({ children, params }: LayoutProps) {
  const { lng } = use(params);
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
