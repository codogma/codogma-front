'use client';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import InterestsIcon from '@mui/icons-material/Interests';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
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

export default WithAuth(Layout);
