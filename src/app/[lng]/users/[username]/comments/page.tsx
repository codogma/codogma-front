'use client';
import { Box, Divider, Skeleton, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

import { AvatarImage } from '@/components/AvatarImage';
import { CustomPagination } from '@/components/CustomPagination';
import { Search } from '@/components/Search';
import { TimeAgo } from '@/components/TimeAgo';
import { contlCookie } from '@/constants/i18n';
import { getComments, GetCommentsDTO } from '@/helpers/commentAPI';
import { GetComment } from '@/types';

type PageParams = {
  username: string;
  lng: string;
};

type PageProps = {
  readonly params: PageParams;
};

export default function Page({ params: { username, lng } }: PageProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] = useState<number>(10);
  const [searchValue, setSearchValue] = useState<string>();
  const [searchType, setSearchType] = useState<string>('content');

  const onSearchType = (type: string) => {
    setSearchType(type);
  };

  const onSearchValue = (value: string) => {
    setSearchValue(value);
    setCurrentPage(0);
  };

  const { data, isFetching, refetch } = useQuery<GetCommentsDTO>({
    queryKey: [
      'comments',
      username,
      currentPage,
      resultsPerPage,
      searchType,
      searchValue,
    ],
    queryFn: () => {
      const byContent = searchType === 'content' ? searchValue : undefined;
      return getComments(
        undefined,
        username,
        byContent,
        currentPage,
        resultsPerPage,
      );
    },
  });

  const comments: GetComment[] = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  useEffect(() => {
    window.addEventListener(contlCookie, () => refetch());
    if (window.location.hash === '#search-input' && searchInputRef.current) {
      searchInputRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      searchInputRef.current.focus();
    }
  }, [refetch]);

  const onPageChange = (value: number) => {
    setCurrentPage(value);
  };

  const onResultsPerPageChange = (value: number) => {
    setResultsPerPage(value);
  };

  return (
    <>
      <Search
        lang={lng}
        onSearchType={onSearchType}
        onSearchValue={onSearchValue}
      />
      {isFetching ? (
        <Card variant='outlined' className='card'>
          <CardContent className='card-content'>
            <Skeleton variant='text' width={250} />
            <div className='meta-container'>
              <Skeleton variant='rounded' width={32} height={32} />
              <p>
                <Skeleton variant='text' width={100} />
              </p>
            </div>
            <Skeleton variant='text' width={250} />
          </CardContent>
        </Card>
      ) : (
        comments?.map((comment) => (
          <Card key={comment.id} variant='outlined' className='card'>
            <CardContent className='card-content'>
              <Link
                href={`/articles/${comment.article.id}`}
                className='article-title'
              >
                {comment.article.title}
              </Link>
              <Box className='py-4'>
                <Divider />
              </Box>
              <Box className='meta-container'>
                <AvatarImage
                  className='article-user-avatar'
                  src={comment.user.avatarUrl}
                  alt={comment.user.username}
                  variant='rounded'
                  size={32}
                />
                <Link
                  className='article-user-name'
                  href={`/users/${comment.user.username}`}
                >
                  {comment.user.username}
                </Link>
                <TimeAgo
                  datetime={comment.createdAt}
                  className='article-datetime'
                  lang={lng}
                />
              </Box>
              <Typography variant='body1'>{comment.content}</Typography>
            </CardContent>
          </Card>
        ))
      )}
      <CustomPagination
        lang={lng}
        totalPages={totalPages}
        totalElements={totalElements}
        onCurrentPageChange={onPageChange}
        onResultsPerPageChange={onResultsPerPageChange}
      />
    </>
  );
}
