'use client';
import { Badge, Button, CardActions, Skeleton, Stack } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react';

import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import { AvatarImage } from '@/components/AvatarImage';
import { getCompilationById } from '@/helpers/compilationApi';
import { GetCompilation, UserRole } from '@/types';

type PageParams = {
  id: number;
  lng: string;
};

type PageProps = {
  readonly params: PageParams;
  readonly children: React.ReactNode;
};

export default function Layout({ params: { id, lng }, children }: PageProps) {
  const { state } = useAuth();
  const { t } = useTranslation(lng);

  const { data: compilation, isFetching } = useQuery<GetCompilation>({
    queryKey: ['compilation', id],
    queryFn: () => getCompilationById(id),
  });

  return (
    <section>
      <Card variant='outlined' className='card'>
        <CardContent className='card-content'>
          {isFetching ? (
            <div className='meta-container'>
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
              <div className='meta-container'>
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
                    alt={compilation?.title}
                    className='category-img'
                    variant='rounded'
                    src={compilation?.imageUrl}
                    size={48}
                  />
                </Badge>
                <div>
                  <h1 className='category-card-name'>{compilation?.title}</h1>
                  <p className='category-card-description'>
                    {compilation?.description}
                  </p>
                </div>
              </div>
              <CardActions className='m-0 p-0'>
                <Stack direction='row' spacing={2}>
                  {state.user?.role === UserRole.ROLE_ADMIN && (
                    <Link href={`/categories/edit/${compilation?.id}`}>
                      <Button className='article-btn' variant='outlined'>
                        {t('editBtn')}
                      </Button>
                    </Link>
                  )}
                </Stack>
              </CardActions>
              <Button className='article-btn' variant='outlined'>
                Удалить
              </Button>
            </>
          )}
        </CardContent>
      </Card>
      {children}
    </section>
  );
}
