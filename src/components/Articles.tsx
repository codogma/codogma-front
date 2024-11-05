'use client';
import { Button, Skeleton } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import React from 'react';

import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import { AvatarImage } from '@/components/AvatarImage';
import ButtonAlertDialog from '@/components/ButtonAlertDialog';
import { TimeAgo } from '@/components/TimeAgo';
import { Article, UserRole } from '@/types';

type ArticlesProps = {
  readonly lang: string;
  readonly articles: Article[];
  readonly loading: boolean;
};

export default function Articles({ lang, articles, loading }: ArticlesProps) {
  const { state } = useAuth();
  const { t } = useTranslation(lang);

  return (
    <>
      {loading ? (
        <Card variant='outlined' className='card'>
          <CardContent className='card-content'>
            <div className='meta-container'>
              <Skeleton variant='rounded' width={32} height={32} />
              <Skeleton variant='text' width={300} />
            </div>
            <div>
              <Skeleton variant='text' width={600} />
            </div>
            <div>
              <Skeleton variant='text' width={600} />
            </div>
            <div>
              <Skeleton variant='text' width={600} />
            </div>
          </CardContent>
        </Card>
      ) : (
        articles?.map((article) => (
          <Card key={article.id} variant='outlined' className='card'>
            <CardContent className='card-content'>
              <div className='meta-container'>
                <AvatarImage
                  alt={article.username}
                  className='article-user-avatar'
                  src={article.authorAvatarUrl}
                  variant='rounded'
                  size={32}
                />
                <Link
                  href={`/users/${article.username}`}
                  className='article-user-name'
                >
                  {article.username}
                </Link>
                <TimeAgo
                  datetime={article.createdAt}
                  className='article-datetime'
                  lang={lang}
                />
              </div>
              <Link href={`/articles/${article.id}`} className='article-title'>
                {article.title}
              </Link>
              <div className='article-category'>
                {article.categories?.map((category) => (
                  <span className='category-item' key={category.id}>
                    <Link
                      className='category-link'
                      href={`/categories/${category.id}`}
                    >
                      {category.name}
                    </Link>
                  </span>
                ))}
              </div>
              <div className='article-content'>
                {article.previewContentNode}
              </div>
            </CardContent>
            <CardActions>
              <Stack direction='row' spacing={2}>
                <Link href={`/articles/${article.id}`}>
                  <Button className='article-btn' variant='outlined'>
                    {t('readMoreBtn')}
                  </Button>
                </Link>
                {state.user?.username === article.username &&
                  state.user.role === UserRole.ROLE_AUTHOR && (
                    <ButtonAlertDialog lang={lang} />
                  )}
              </Stack>
            </CardActions>
          </Card>
        ))
      )}
    </>
  );
}
