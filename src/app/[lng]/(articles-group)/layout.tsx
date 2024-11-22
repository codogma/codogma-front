'use server';
import React, { ReactNode } from 'react';

import { initTranslation } from '@/app/i18n';
import NavTabs, { TabProps } from '@/components/NavTabs';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: { lng: string };
};

export default async function Layout({
  params: { lng },
  children,
}: LayoutProps) {
  const { t } = await initTranslation(lng);
  const tabs: TabProps[] = [
    { label: `${t('articles')}`, href: `/${lng}/articles` },
    { label: `${t('categories')}`, href: `/${lng}/categories` },
    { label: `${t('authors')}`, href: `/${lng}/authors` },
  ];
  return (
    <>
      <NavTabs tabs={tabs} />
      {children}
    </>
  );
}
