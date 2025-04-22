'use client';
import ArticleIcon from '@mui/icons-material/Article';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { CardHeader, Skeleton } from '@mui/material';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import { AvatarImage } from '@/components/AvatarImage';
import { ButtonFavorite } from '@/components/ButtonFavorite';
import MenuButton from '@/components/MenuButton';
import { NavTabs, TabProps } from '@/components/NavTabs';
import { getCategoryById } from '@/helpers/categoryApi';
import { GetCategory, Language, UserRole } from '@/types';

type PageParams = {
  id: number;
  lng: Language;
  refetch?: () => void;
};

type PageProps = {
  readonly params: PageParams;
  readonly children: React.ReactNode;
};

export default function Layout({
  params: { id, lng, refetch },
  children,
}: PageProps) {
  const { state } = useAuth();
  const { t } = useTranslation(lng);
  const tabs: TabProps[] = [
    {
      icon: <ArticleIcon />,
      label: t('articles'),
      href: `/${lng}/categories/${id}/articles`,
    },
    {
      icon: <PeopleAltIcon />,
      label: t('authors'),
      href: `/${lng}/categories/${id}/authors`,
    },
  ];

  const { data: category, isFetching } = useQuery<GetCategory>({
    queryKey: ['category', id],
    queryFn: () => getCategoryById(id),
  });

  return (
    <section>
      <Card variant='outlined' className='card'>
        {isFetching ? (
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
            <CardHeader
              avatar={
                <AvatarImage
                  alt={category?.name}
                  className='category-img'
                  variant='rounded'
                  src={category?.imageUrl}
                  size={48}
                />
              }
              action={
                state.user?.role !== UserRole.ROLE_ADMIN ? (
                  <ButtonFavorite
                    lang={lng}
                    isFavoriteValue={category?.isFavorite}
                    id={id}
                  />
                ) : (
                  <MenuButton
                    category={category}
                    lang={lng}
                    refetch={refetch}
                  />
                )
              }
              title={
                <Typography className='category-card-name'>
                  {category?.name}
                </Typography>
              }
              subheader={
                <Typography className='category-card-description'>
                  {category?.description}
                </Typography>
              }
            />
          </>
        )}
      </Card>
      <NavTabs tabs={tabs} />
      {children}
    </section>
  );
}
