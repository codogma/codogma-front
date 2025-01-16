'use client';
import { Badge, Button, Skeleton } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import { AvatarImage } from '@/components/AvatarImage';
import { Bookmark } from '@/components/Bookmark';
import { EditCompilation } from '@/components/EditCompilation';
import {
  deleteCompilation,
  getCompilationById,
} from '@/helpers/compilationApi';
import { GetCompilation } from '@/types';

type PageParams = {
  id: number;
  lng: string;
  isHiddenBookmarks?: boolean;
  refetch?: () => void;
};

type PageProps = {
  readonly params: PageParams;
  readonly children: React.ReactNode;
};

export default function Layout({
  params: { id, lng, isHiddenBookmarks, refetch },
  children,
}: PageProps) {
  const { state } = useAuth();
  const { t } = useTranslation(lng);

  const { data, isFetching } = useQuery<GetCompilation>({
    queryKey: ['compilation', id],
    queryFn: () => getCompilationById(id),
  });

  const handleDelete = () => {
    deleteCompilation(id);
  };

  const compilation = data as GetCompilation;

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
                    alt={compilation.title}
                    className='category-img'
                    variant='rounded'
                    src={compilation.imageUrl}
                    size={48}
                  />
                </Badge>
                <div>
                  <h1 className='category-card-name'>{compilation.title}</h1>
                  <p className='category-card-description'>
                    {compilation.description}
                  </p>
                </div>
                {!isHiddenBookmarks && (
                  <Bookmark
                    lang={lng}
                    id={compilation.id}
                    isBookmarkedValue={compilation.isBookmarked}
                    refetch={refetch}
                  />
                )}
              </div>
              {state.user?.username === compilation.ownerName && (
                <>
                  <EditCompilation
                    compilationData={compilation}
                    lang={lng}
                    id={compilation.id}
                    refetch={refetch}
                  />
                  <Button
                    className='article-btn'
                    variant='outlined'
                    onClick={handleDelete}
                  >
                    Удалить
                  </Button>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
      {children}
    </section>
  );
}
