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
    <Grid container spacing={2}>
      {(loading ? Array.from(new Array(12)) : articles)?.map((article) => (
        <Grid key={article?.id} size={{ xs: 12, sm: 6, lg: 4 }}>
          {article ? (
            <ArticleCard article={article} lang={lang} />
          ) : (
            <Card variant='outlined' className='card'>
              <CardContent>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <Skeleton
                    animation='wave'
                    variant='rounded'
                    width={40}
                    height={40}
                  />
                  <div style={{ flex: 1 }}>
                    <Skeleton
                      animation='wave'
                      height={10}
                      width='80%'
                      style={{ marginBottom: 6 }}
                    />
                    <Skeleton animation='wave' height={10} width='40%' />
                  </div>
                </div>
              </CardContent>
              <Skeleton
                sx={{ height: 190 }}
                animation='wave'
                variant='rectangular'
              />
              <CardContent>
                <Skeleton
                  animation='wave'
                  height={10}
                  style={{ marginBottom: 6 }}
                />
                <Skeleton animation='wave' height={10} width='80%' />
              </CardContent>
            </Card>
          )}
        </Grid>
      ))}
    </Grid>
  );
}
