'use client';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import ArticleIcon from '@mui/icons-material/Article';
import CommentIcon from '@mui/icons-material/Comment';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PersonIcon from '@mui/icons-material/Person';
import { Badge, Skeleton } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import React, { use } from 'react';

import { AvatarImage } from '@/components/AvatarImage';
import { MenuButton } from '@/components/MenuButton';
import { NavTabs, TabProps } from '@/components/NavTabs';
import { getUserByUsername } from '@/helpers/userApi';
import { GetUserDTO, Language } from '@/types';

type PageProps = {
  readonly params: Promise<{ username: string; lng: string }>;
  readonly children: React.ReactNode;
};

export default function Layout({ children, params }: PageProps) {
  const { lng, username } = use(params);
  const lang = lng as Language;
  const t = useTranslations();
  const tabs: TabProps[] = [
    {
      icon: <PersonIcon />,
      label: `${t('profile')}`,
      href: `/${lng}/users/${username}/profile`,
    },
    {
      icon: <ArticleIcon />,
      label: `${t('articles')}`,
      href: `/${lng}/users/${username}/articles`,
    },
    {
      icon: <HowToRegIcon />,
      label: `${t('subscribers')}`,
      href: `/${lng}/users/${username}/subscribers`,
    },
    {
      icon: <CommentIcon />,
      label: `${t('comments')}`,
      href: `/${lng}/users/${username}/comments`,
    },
    {
      icon: <ArrowCircleRightOutlinedIcon />,
      label: `${t('history')}`,
      href: `/${lng}/users/${username}/history`,
    },
  ];

  const { data, isPending } = useQuery<GetUserDTO>({
    queryKey: ['user', username],
    queryFn: () => getUserByUsername(username),
  });

  const user: GetUserDTO = data as GetUserDTO;

  return (
    <section>
      <Card variant='outlined' className='card'>
        <CardContent className='card-content'>
          {isPending ? (
            <div className='card-header'>
              <Skeleton className='category-img' variant='rounded' />
              <div>
                <h1 className='category-card-name'>
                  <Skeleton variant='text' width={150} />
                </h1>
                <p className='category-card-shortInfo'>
                  <Skeleton variant='text' width={200} />
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className='card-header'>
                <Badge
                  className='items-start'
                  overlap='circular'
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <IconButton
                      component='label'
                      color='inherit'
                      sx={{ p: 0 }}
                    />
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
                <div>
                  <h1 className='category-card-name'>
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <p className='category-card-shortInfo'>{user?.shortInfo}</p>
                </div>
              </div>
              <MenuButton user={user} lang={lang} />
            </>
          )}
        </CardContent>
      </Card>
      <NavTabs tabs={tabs} />
      {children}
    </section>
  );
}
