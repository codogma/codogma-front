'use client';
import React, { useEffect, useState } from 'react';
import { User } from '@/types';
import NavTabs, { LinkTabProps } from '@/components/NavTabs';
import CardContent from '@mui/material/CardContent';
import { Badge } from '@mui/material';
import Card from '@mui/material/Card';
import { getUserByUsername } from '@/helpers/userApi';
import IconButton from '@mui/material/IconButton';
import { AvatarImage } from '@/components/AvatarImage';
import { ButtonWithPopover } from '@/components/ButtonWithPopover';

type PageParams = {
  username: string;
};

type PageProps = {
  params: PageParams;
  children: React.ReactNode;
};

export default function Layout({ params, children }: PageProps) {
  const username: string = params.username;
  const [user, setUser] = useState<User>();

  const tabs: LinkTabProps[] = [
    { label: 'Profile', href: `/users/${username}/profile` },
    { label: 'Articles', href: `/users/${username}/articles` },
    { label: 'Subscribers', href: `/users/${username}/subscribers` },
    { label: 'Subscriptions', href: `/users/${username}/subscriptions` },
    { label: 'Comments', href: `/users/${username}/comments` },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getUserByUsername(username);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching data:', error);
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

            <ButtonWithPopover username={username} />
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
