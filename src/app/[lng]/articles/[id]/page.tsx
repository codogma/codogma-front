'use client';
import React from 'react';
import { UserRole } from '@/types';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import { TimeAgo } from '@/components/TimeAgo';
import { Button } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useAuth } from '@/components/AuthProvider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CommentList } from '@/components/CommentList';
import Typography from '@mui/material/Typography';
import { AvatarImage } from '@/components/AvatarImage';
import { useContentImageContext } from '@/components/ContentImageProvider';
import { useArticle } from '@/components/ArticleProvider';
import { useTranslation } from '@/app/i18n/client';

type PageParams = {
  lng: string;
};

type PageProps = {
  params: PageParams;
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
                  <Link className='tag-link' href={`/categories/${tag.id}`}>
                    {tag.name}
                  </Link>
                </span>
              ))}
            </div>
          </div>
          {state.user?.username === article.username &&
            state.user?.role === UserRole.ROLE_AUTHOR && (
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
        </CardContent>
      </Card>
      <Typography component='div'>{t('comments')}:</Typography>
      <CommentList articleId={article.id} lang={lng} />
    </>
  );
}
