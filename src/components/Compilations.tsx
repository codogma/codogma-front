'use client';
import Grid from '@mui/material/Grid2';
import React from 'react';

import { CompilationCard } from '@/components/CompilationCard';
import { GetCompilation, Language } from '@/types';

type CompilationsProps = {
  readonly compilations: GetCompilation[];
  readonly loading: boolean;
  readonly compilationsPerPageStart: number;
  readonly lang: Language;
  readonly refetch?: () => void;
};

export default function Compilations({
  compilations,
  loading,
  compilationsPerPageStart,
  lang,
  refetch,
}: CompilationsProps) {
  return (
    <Grid container spacing={2}>
      {(loading
        ? Array.from(new Array(compilationsPerPageStart))
        : compilations
      )?.map((compilation, key) => (
        <Grid
          key={compilation ? compilation.id : `skeleton-${key}`}
          size={{ xs: 12, sm: 6, lg: 4 }}
        >
          <CompilationCard
            compilation={compilation}
            lang={lang}
            refetch={refetch}
          />
        </Grid>
      ))}
    </Grid>
  );
}
