'use client';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import DOMPurify from 'dompurify';
import Link from 'next/link';
import React from 'react';

import { useTranslation } from '@/app/i18n/client';
import { useArticle } from '@/components/ArticleProvider';
import { useAuth } from '@/components/AuthProvider';
import { AvatarImage } from '@/components/AvatarImage'; // import { CommentList } from '@/components/CommentList';
import ButtonAlertDialog from '@/components/ButtonAlertDialog';
import { CommentList } from '@/components/CommentList';
import { useContentImageContext } from '@/components/ContentImageProvider';
import { TimeAgo } from '@/components/TimeAgo';
import { UserRole } from '@/types';

type PageParams = {
  lng: string;
};

type PageProps = {
  readonly params: PageParams;
};

export default function Page({ params: { lng } }: PageProps) {
  const { article } = useArticle();
  const { state } = useAuth();
  const { processContent } = useContentImageContext();
  const { t } = useTranslation(lng);
  const content = processContent(DOMPurify.sanitize(article.content));

  return (
    <>
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
              className='article-user-name'
              href={`/users/${article.username}`}
            >
              {article.username}
            </Link>
            <TimeAgo
              datetime={article.createdAt}
              className='article-datetime'
              lang={lng}
            />
          </div>
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
          <div className='article-content'>{content}</div>
          <div className='article-presenter-meta'>
            <div className='article-category-pm'>
              Категории:{' '}
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
            <div className='article-tag-pm'>
              Теги:{' '}
              {article.tags?.map((tag) => (
                <span className='tag-item' key={tag.id}>
                  <Link
                    className='tag-link'
                    href={`/categories/${tag.id}`}
                  >
                    {tag.name}
                  </Link>
                </span>
              ))}
            </div>
          </div>
          {state.user?.username === article.username &&
            state.user?.role === UserRole.ROLE_AUTHOR && (
              <ButtonAlertDialog articleId={article.id} lang={lng} />
            )}
        </CardContent>
      </Card>
      <Typography component='div'>{t('comments')}:</Typography>
      <CommentList articleId={article.id} lang={lng} />
    </>
  );
}
