'use client';
import { Skeleton } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid2';
import React from 'react';

import { ArticleCard } from '@/components/ArticleCard';
import { GetArticle, Language } from '@/types';

type ArticlesProps = {
  readonly lang: Language;
  readonly articles: GetArticle[];
  readonly loading: boolean;
};

export default function Articles({ lang, articles, loading }: ArticlesProps) {
  return (
    <>
      {loading ? (
        <Card variant='outlined' className='card'>
          <CardContent className='card-content'>
            <div className='card-header'>
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
        <Grid container direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          {articles?.map((article) => (
            <Grid key={article.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <ArticleCard article={article} lang={lang} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
