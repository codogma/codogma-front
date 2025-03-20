'use client';
import { Skeleton, Theme, useMediaQuery } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid2';
import React from 'react';

import { useTranslation } from '@/app/i18n/client';
import { ArticleCard } from '@/components/ArticleCard';
import { Article, Language } from '@/types';

type ArticlesProps = {
  readonly lang: Language;
  readonly articles: Article[];
  readonly loading: boolean;
};

export default function Articles({ lang, articles, loading }: ArticlesProps) {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('xs'));
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
      ) : isSmall ? (
        <Grid
          container
          direction='column'
          sx={{
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          {articles?.map((article) => (
            <ArticleCard key={article.id} article={article} lang={lang} />
          ))}
        </Grid>
      ) : (
        <>
          {articles?.map((article) => (
            <ArticleCard key={article.id} article={article} lang={lang} />
          ))}
        </>
      )}
    </>
  );
}
