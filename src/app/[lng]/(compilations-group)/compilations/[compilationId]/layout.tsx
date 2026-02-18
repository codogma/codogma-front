'use client';
import { CardHeader, Skeleton } from '@mui/material';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import React, { use, useState } from 'react';

import { AvatarImage } from '@/components/AvatarImage';
import { Bookmark } from '@/components/Bookmark';
import { CompilationProvider } from '@/components/CompilationProvider';
import MenuButton from '@/components/MenuButton';
import { useNavigation } from '@/components/NavigationProvider';
import { getCompilationById } from '@/helpers/compilationApi';
import { GetCompilation, Language } from '@/types';

type PageProps = {
  readonly params: Promise<{ compilationId: string; lng: string }>;
  readonly children: React.ReactNode;
};

export default function Layout({ children, params }: PageProps) {
  const { compilationId, lng } = use(params);
  const lang = lng as Language;
  const compilationIdNum = Number(compilationId);
  const { data: state } = useSession();
  const [isRefetch, setIsRefetch] = useState<boolean>(false);
  const { isFullscreen } = useNavigation();

  const refetch = () => {
    setIsRefetch(true);
  };

  const resetRefetch = () => {
    setIsRefetch(false);
  };

  const { data: compilation, isPending } = useQuery<GetCompilation>({
    queryKey: ['compilation', compilationIdNum],
    queryFn: () => getCompilationById(compilationIdNum),
  });

  return (
    <div className='grid gap-2'>
      <Card
        variant='outlined'
        className='card'
        sx={{ display: isFullscreen ? 'none' : 'block' }}
      >
        {isPending ? (
          <div className='card-header'>
            <Skeleton className='category-img' variant='rounded' />
            <div>
              <h1 className='category-card-name'>
                <Skeleton variant='text' width={150} />
              </h1>
              <p className='category-card-description'>
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
              state?.user?.name !== compilation?.ownerName ? (
                <Bookmark
                  username={compilation?.ownerName}
                  id={compilationIdNum}
                  isBookmarkedValue={compilation?.isBookmarked}
                  refetch={refetch}
                />
              ) : (
                <MenuButton
                  compilation={compilation}
                  lang={lang}
                  refetch={refetch}
                />
              )
            }
            title={
              <Link
                href={`/compilations/${compilationId}`}
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
      </Card>
      <div className='box-border min-w-0'>
        <CompilationProvider isRefetch={isRefetch} resetRefetch={resetRefetch}>
          {children}
        </CompilationProvider>
      </div>
    </div>
  );
}
