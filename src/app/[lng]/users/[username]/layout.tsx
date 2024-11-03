'use client';
import { Badge } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import React, { useEffect, useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { AvatarImage } from '@/components/AvatarImage';
import { ButtonWithPopover } from '@/components/ButtonWithPopover';
import NavTabs, { TabProps } from '@/components/NavTabs';
import { devConsoleError } from '@/helpers/devConsoleLogs';
import { getUserByUsername } from '@/helpers/userApi';
import { User } from '@/types';

type PageParams = {
  username: string;
  lng: string;
};

type PageProps = {
  readonly params: PageParams;
  readonly children: React.ReactNode;
};

export default function Layout({
  params: { lng, username },
  children,
}: PageProps) {
  const { t } = useTranslation(lng);
  const [user, setUser] = useState<User>();

  const tabs: TabProps[] = [
    { label: `${t('profile')}`, href: `/${lng}/users/${username}/profile` },
    { label: `${t('articles')}`, href: `/${lng}/users/${username}/articles` },
    {
      label: `${t('subscribers')}`,
      href: `/${lng}/users/${username}/subscribers`,
    },
    {
      label: `${t('subscriptions')}`,
      href: `/${lng}/users/${username}/subscriptions`,
    },
    { label: `${t('comments')}`, href: `/${lng}/users/${username}/comments` },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getUserByUsername(username);
        setUser(userData);
      } catch (error) {
        devConsoleError('Error fetching data:', error);
      }
    }

    fetchData();
  }, [username]);

  return (
    <section>
      <Card variant='outlined' className='card'>
        <CardContent className='card-content'>
          <div className='meta-container'>
            <Badge
              className='items-start'
              overlap='circular'
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <IconButton component='label' color='inherit' sx={{ p: 0 }} />
              }
            >
              <AvatarImage
                alt={user?.username}
                className='category-img'
                variant='rounded'
                src={user?.avatarUrl}
                size={48}
              />
            </Badge>
            <ButtonWithPopover username={username} lang={lng} />
            <div>
              <h1 className='category-card-name'>
                {user?.firstName} {user?.lastName}
              </h1>
              <p className='category-card-shortInfo'>{user?.shortInfo}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <NavTabs tabs={tabs} />
      {children}
    </section>
  );
}
