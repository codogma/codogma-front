'use client';
import React from 'react';
import { Article, UserRole } from '@/types';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Link from 'next/link';
import { TimeAgo } from '@/components/TimeAgo';
import { Button, Skeleton } from '@mui/material';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { useAuth } from '@/components/AuthProvider';
import { AvatarImage } from '@/components/AvatarImage';
import { useTranslation } from '@/app/i18n/client';

type ArticlesProps = {
  lang: string;
  articles: Article[];
  loading: boolean;
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
                    <Link href={`/articles/edit/${article.id}`}>
                      <Button
                        className='article-btn'
                        variant='outlined'
                        startIcon={<EditOutlinedIcon />}
                      >
                        {t('editBtn')}
                      </Button>
                    </Link>
                  )}
              </Stack>
            </CardActions>
          </Card>
        ))
      )}
    </>
  );
}
