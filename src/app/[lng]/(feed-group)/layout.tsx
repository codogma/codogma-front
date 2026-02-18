import HowToRegIcon from '@mui/icons-material/HowToReg';
import InterestsIcon from '@mui/icons-material/Interests';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import { useTranslations } from 'next-intl';
import React, { ReactNode, use } from 'react';

import { NavTabs, TabProps } from '@/components/NavTabs';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: Promise<{ lng: string }>;
};

export default function Layout({ params, children }: LayoutProps) {
  const { lng } = use(params);
  const t = useTranslations();
  const tabs: TabProps[] = [
    {
      icon: <PlaylistAddCheckCircleIcon />,
      label: `${t('feed')}`,
      href: `/${lng}/feed`,
    },
    {
      icon: <InterestsIcon />,
      label: `${t('favoriteCategories')}`,
      href: `/${lng}/favorite-categories`,
    },
    {
      icon: <HowToRegIcon />,
      label: `${t('subscriptions')}`,
      href: `/${lng}/subscriptions`,
    },
  ];
  return (
    <>
      <NavTabs tabs={tabs} />
      {children}
    </>
  );
}
