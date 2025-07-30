'use client';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import InterestsIcon from '@mui/icons-material/Interests';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import { useTranslations } from 'next-intl';
import React, { ReactNode } from 'react';

import { NavTabs, TabProps } from '@/components/NavTabs';
import { WithAuth } from '@/components/WithAuth';
import { Language } from '@/types';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: { lng: Language };
};

function Layout({ params: { lng }, children }: LayoutProps) {
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

export default WithAuth(Layout);
