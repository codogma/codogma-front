'use server';
import ArticleIcon from '@mui/icons-material/Article';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import React, { ReactNode } from 'react';

import { initTranslation } from '@/app/i18n';
import NavTabs, { TabProps } from '@/components/NavTabs';
import { Language } from '@/types';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: { lng: Language };
};

export default async function Layout({
  params: { lng },
  children,
}: LayoutProps) {
  const { t } = await initTranslation(lng);
  const tabs: TabProps[] = [
    {
      icon: <ArticleIcon />,
      label: `${t('articles')}`,
      href: `/${lng}/articles`,
    },
    {
      icon: <CategoryIcon />,
      label: `${t('categories')}`,
      href: `/${lng}/categories`,
    },
    {
      icon: <PeopleAltIcon />,
      label: `${t('authors')}`,
      href: `/${lng}/authors`,
    },
  ];
  return (
    <>
      <NavTabs tabs={tabs} />
      {children}
    </>
  );
}
