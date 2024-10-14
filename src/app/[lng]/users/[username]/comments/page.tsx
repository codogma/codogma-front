'use client';
import { Box, Divider, Skeleton, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react';

import { AvatarImage } from '@/components/AvatarImage';
import { TimeAgo } from '@/components/TimeAgo';
import { getCommentsByUsername } from '@/helpers/commentAPI';
import { GetComment } from '@/types';

type PageParams = {
  username: string;
  lng: string;
};

type PageProps = {
  params: PageParams;
};

export default function Page({ params: { username, lng } }: PageProps) {
  const { data: comments, isPending } = useQuery<GetComment[]>({
    queryKey: ['comments', username],
    queryFn: () => getCommentsByUsername(username),
  });

  return (
    <>
      {isPending ? (
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
    </>
  );
}
