'use client';
import React, { ReactNode } from 'react';

import { useTranslation } from '@/app/i18n/client';
import NavTabs, { TabProps } from '@/components/NavTabs';
import { WithAuth } from '@/components/WithAuth';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: { lng: string };
};

function Layout({ params: { lng }, children }: LayoutProps) {
  const { t } = useTranslation(lng);
  const tabs: TabProps[] = [
    { label: `${t('compilations')}`, href: `/${lng}/compilations` },
    {
      label: `${t('bookmarks')}`,
      href: `/${lng}/bookmarks`,
    },
    {
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

export default WithAuth(Layout);
