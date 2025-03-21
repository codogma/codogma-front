import { Button, CardHeader, CardMedia } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import React from 'react';

import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import { AvatarImage } from '@/components/AvatarImage';
import { DefaultImage } from '@/components/DefaultImage';
import MenuButton from '@/components/MenuButton';
import { TimeAgo } from '@/components/TimeAgo';
import { Article, Language, UserRole } from '@/types';

type ArticleCardProps = {
  readonly article: Article;
  readonly lang: Language;
};

export const ArticleCard = ({ article, lang }: ArticleCardProps) => {
  const { state } = useAuth();
  const { t } = useTranslation(lang);

  return (
    <Card key={article.id} variant='outlined' className='article-card card'>
      <CardHeader
        avatar={
          <AvatarImage
            alt={article.username}
            className='article-user-avatar'
            src={article.authorAvatarUrl}
            variant='rounded'
            size={32}
          />
        }
        action={
          state.isAuthenticated &&
          state.user?.role !== UserRole.ROLE_ADMIN && (
            <MenuButton article={article} lang={lang} />
          )
        }
        title={
          <Link
            href={`/users/${article.username}`}
            className='article-user-name'
          >
            {article.username}
          </Link>
        }
        subheader={
          <TimeAgo
            datetime={article.createdAt}
            className='article-datetime'
            lang={lang}
          />
        }
        className='card-header'
      />
      <CardMedia>
        <DefaultImage
          position='relative'
          src='/images/banner.png'
          width={318}
        />
      </CardMedia>
      {/*{(state.user?.username === article.username ||*/}
      {/*  state.user?.role === UserRole.ROLE_ADMIN) && (*/}
      {/*  <Stack direction='row' spacing={1}>*/}
      {/*    <Chip label={article.status} variant='outlined' />*/}
      {/*    <Chip label={article.language.toUpperCase()} variant='outlined' />*/}
      {/*  </Stack>*/}
      {/*)}*/}
      <CardContent className='card-content'>
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
        <div className='article-content'>{article.previewContentNode}</div>
      </CardContent>
      <CardActions>
        <Stack direction='row' spacing={2}>
          <Link href={`/articles/${article.id}`}>
            <Button className='article-btn' variant='outlined'>
              {t('readMoreBtn')}
            </Button>
          </Link>
        </Stack>
      </CardActions>
    </Card>
  );
};
