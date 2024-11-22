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
    { label: `${t('feed')}`, href: `/${lng}/feed` },
    {
      label: `${t('favoriteCategories')}`,
      href: `/${lng}/favorite-categories`,
    },
    { label: `${t('subscriptions')}`, href: `/${lng}/subscriptions` },
  ];
  return (
    <>
      <NavTabs tabs={tabs} />
      {children}
    </>
  );
}

export default WithAuth(Layout);
