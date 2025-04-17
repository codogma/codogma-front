'use client';
import { CardHeader, Skeleton } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React, { useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import { AvatarImage } from '@/components/AvatarImage';
import { Bookmark } from '@/components/Bookmark';
import { CompilationProvider } from '@/components/CompilationProvider';
import MenuButton from '@/components/MenuButton';
import { getCompilationById } from '@/helpers/compilationApi';
import { GetCompilation, Language } from '@/types';

type PageParams = {
  id: number;
  lng: Language;
};

type PageProps = {
  readonly params: PageParams;
  readonly children: React.ReactNode;
};

export default function Layout({ params: { id, lng }, children }: PageProps) {
  const { state } = useAuth();
  const [isRefetch, setIsRefetch] = useState<boolean>(false);
  const { t } = useTranslation(lng);

  const refetch = () => {
    setIsRefetch(true);
  };

  const resetRefetch = () => {
    setIsRefetch(false);
  };

  const { data: compilation, isFetching } = useQuery<GetCompilation>({
    queryKey: ['compilation', id],
    queryFn: () => getCompilationById(id),
  });

  return (
    <section className='grid gap-2'>
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
            <CardHeader
              avatar={
                <AvatarImage
                  alt={compilation?.title}
                  className='category-img'
                  variant='rounded'
                  src={compilation?.imageUrl}
                  size={48}
                />
              }
              action={
                state.user?.username !== compilation?.ownerName ? (
                  <Bookmark
                    username={compilation?.ownerName}
                    lang={lng}
                    id={id}
                    isBookmarkedValue={compilation?.isBookmarked}
                    refetch={refetch}
                  />
                ) : (
                  <MenuButton
                    compilation={compilation}
                    lang={lng}
                    refetch={refetch}
                  />
                )
              }
              title={
                <Link
                  href={`/compilations/${id}`}
                  className='category-card-name'
                >
                  {compilation?.title}
                </Link>
              }
              subheader={
                <Typography className='category-card-description'>
                  {compilation?.description}
                </Typography>
              }
              className='card-header'
            />
          )}
        </CardContent>
      </Card>
      <div className='box-border min-w-0'>
        <CompilationProvider isRefetch={isRefetch} resetRefetch={resetRefetch}>
          {children}
        </CompilationProvider>
      </div>
    </section>
  );
}
