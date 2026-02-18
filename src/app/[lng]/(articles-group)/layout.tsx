import ArticleIcon from '@mui/icons-material/Article';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { useTranslations } from 'next-intl';
import React, { ReactNode, use } from 'react';

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
