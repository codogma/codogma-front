'use client';
import { Card, CardContent, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React from 'react';

import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
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
  const { state } = useAuth();
  const { t } = useTranslation(lang);

  return (
    <>
      {loading ? (
        <Card variant='outlined' className='card'>
          <CardContent className='card-content'>
            <div className='card-header'>
              <Skeleton variant='rounded' width={48} height={48} />
              <ul>
                <li>
                  <Skeleton variant='text' width={100} />
                </li>
                <li>
                  <Skeleton variant='text' width={150} />
                </li>
                <li>
                  <Skeleton variant='text' width={150} />
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Grid container direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          {compilations?.map((compilation) => (
            <Grid key={compilation.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <CompilationCard
                key={compilation.id}
                compilation={compilation}
                lang={lang}
                refetch={refetch}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
