'use client';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ClassIcon from '@mui/icons-material/Class';
import ViewListIcon from '@mui/icons-material/ViewList';
import { Badge } from '@mui/material';
import React, { ReactNode } from 'react';

import { useTranslation } from '@/app/i18n/client';
import NavTabs, { TabProps } from '@/components/NavTabs';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: { lng: string };
};

function Layout({ params: { lng }, children }: LayoutProps) {
  const { t } = useTranslation(lng);
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
      icon: (
        <Badge
          badgeContent={
            <AccountCircleIcon
              sx={{
                marginLeft: -1,
                marginBottom: 2,
                backgroundColor: 'white',
                borderRadius: 5,
                fontSize: 15,
              }}
            />
          }
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <ViewListIcon />
        </Badge>
      ),
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

export default Layout;
