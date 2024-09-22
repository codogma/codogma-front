'use client';

import CardContent from '@mui/material/CardContent';
import { Box, Divider, Typography } from '@mui/material';
import Link from 'next/link';
import { TimeAgo } from '@/components/TimeAgo';
import { GetComment } from '@/types';
import Card from '@mui/material/Card';
import React, { useEffect, useState } from 'react';
import { getCommentsByUsername } from '@/helpers/commentAPI';
import { AvatarImage } from '@/components/AvatarImage';

type PageParams = {
  username: string;
};

type PageProps = {
  params: PageParams;
};

export default function Page({ params }: PageProps) {
  const username: string = params.username;
  const [comments, setComments] = useState<GetComment[]>([]);

  useEffect(() => {
    const getData = async () => {
      return await getCommentsByUsername(username);
    };
    getData()
      .then((response) => setComments(response))
      .catch((error) => console.error(error));
  }, [username]);

  return (
    <>
      {comments.map((comment) => (
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
              />
            </Box>
            <Typography variant='body1'>{comment.content}</Typography>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
