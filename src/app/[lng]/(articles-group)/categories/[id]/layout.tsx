'use client';
import ArticleIcon from '@mui/icons-material/Article';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { Badge, Skeleton } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import { AvatarImage } from '@/components/AvatarImage';
import { ButtonFavorite } from '@/components/ButtonFavorite';
import MenuButton from '@/components/MenuButton';
import NavTabs, { TabProps } from '@/components/NavTabs';
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
        <CardContent className='card-content'>
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
                    alt={category?.name}
                    className='category-img'
                    variant='rounded'
                    src={category?.imageUrl}
                    size={48}
                  />
                </Badge>
                <div>
                  <h1 className='category-card-name'>{category?.name}</h1>
                  <p className='category-card-description'>
                    {category?.description}
                  </p>
                </div>
              </div>
              {state.user?.role !== UserRole.ROLE_ADMIN ? (
                <ButtonFavorite
                  lang={lng}
                  isFavoriteValue={category?.isFavorite}
                  id={id}
                />
              ) : (
                <MenuButton category={category} lang={lng} refetch={refetch} />
              )}
            </>
          )}
        </CardContent>
      </Card>
      <NavTabs tabs={tabs} />
      {children}
    </section>
  );
}
