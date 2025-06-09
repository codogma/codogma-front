'use client';
import { Card, CardContent, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React from 'react';

import { CompilationCard } from '@/components/CompilationCard';
import { GetCompilation, Language } from '@/types';

type CompilationsProps = {
  readonly compilations: GetCompilation[];
  readonly loading: boolean;
  readonly lang: Language;
  readonly refetch?: () => void;
};

export default function Compilations({
  compilations,
  loading,
  lang,
  refetch,
}: CompilationsProps) {
  return (
    <Grid container spacing={2}>
      {(loading ? Array.from(new Array(12)) : compilations)?.map(
        (compilation) => (
          <Grid key={compilation?.id} size={{ xs: 12, sm: 6, lg: 4 }}>
            {compilation ? (
              <CompilationCard
                key={compilation.id}
                compilation={compilation}
                lang={lang}
                refetch={refetch}
              />
            ) : (
              <Card variant='outlined' className='card'>
                <CardContent>
                  <div
                    style={{ display: 'flex', gap: 16, alignItems: 'center' }}
                  >
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
        ),
      )}
    </Grid>
  );
}
