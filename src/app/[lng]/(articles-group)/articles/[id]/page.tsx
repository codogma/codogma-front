'use client';
import { Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useQuery } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import Link from 'next/link';
import React from 'react';

import { useTranslation } from '@/app/i18n/client';
import { AddToCompilations } from '@/components/AddToCompilations';
import { ArticleActions } from '@/components/ArticleActions';
import { useArticle } from '@/components/ArticleProvider';
import Articles from '@/components/Articles';
import { useAuth } from '@/components/AuthProvider';
import { AvatarImage } from '@/components/AvatarImage';
import ButtonAlertDialog from '@/components/ButtonAlertDialog';
import { CommentList } from '@/components/CommentList';
import { useContentImageContext } from '@/components/ContentImageProvider';
import { TimeAgo } from '@/components/TimeAgo';
import { getRecommendationsArticleById } from '@/helpers/articleApi';
import { Article, Language, UserRole } from '@/types';

type PageParams = {
  lng: Language;
  id: number;
};

type PageProps = {
  readonly params: PageParams;
};

export default function Page({ params: { lng, id } }: PageProps) {
  const { article } = useArticle();
  const { state } = useAuth();
  const { processContent } = useContentImageContext();
  const { t } = useTranslation(lng, 'articles');
  const content = processContent(DOMPurify.sanitize(article.content));

  const { data, isFetching } = useQuery<Article>({
    queryKey: ['articles', id],
    queryFn: () => getRecommendationsArticleById(id),
  });

  const articles: Article[] = (data ?? []) as Article[];

  return (
    <>
      <Card key={id} id={`article-${id}`} variant='outlined' className='card'>
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
            {(state.user?.username === article.username ||
              state.user?.role === UserRole.ROLE_ADMIN) && (
              <Stack direction='row' spacing={1}>
                <Chip label={article.status} variant='outlined' />
                <Chip
                  label={article.language.toUpperCase()}
                  variant='outlined'
                />
              </Stack>
            )}
            {state.isAuthenticated &&
              state.user?.role !== UserRole.ROLE_ADMIN && (
                <AddToCompilations
                  id={id}
                  username={state.user?.username}
                  lang={lng}
                  compilations={article.compilations}
                />
              )}
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
              <ButtonAlertDialog articleId={id} lang={lng} />
            )}
        </CardContent>
      </Card>
      <ArticleActions lang={lng} articleData={article} id={id} />
      <CommentList articleId={id} lang={lng} />
      <Typography component='div'>{t('recommendation')}</Typography>
      <Articles lang={lng} articles={articles} loading={isFetching} />
    </>
  );
}
