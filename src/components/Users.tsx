'use client';
import Grid from '@mui/material/Grid2';
import React from 'react';

import { UserCard } from '@/components/UserCard';
import { GetUserDTO, Language } from '@/types';

type AuthorsProps = {
  readonly users: GetUserDTO[];
  readonly loading?: boolean;
  readonly usersPerPageStart: number;
  readonly lang: Language;
};

export default function Users({
  users,
  loading,
  usersPerPageStart,
  lang,
}: AuthorsProps) {
  return (
    <Grid container spacing={2}>
      {(loading ? Array.from(new Array(usersPerPageStart)) : users)?.map(
        (user, key) => (
          <Grid
            key={user ? user.id : `skeleton-${key}`}
            size={{ xs: 12, sm: 6, lg: 4 }}
          >
            <UserCard user={user} lang={lang} />
          </Grid>
        ),
      )}
    </Grid>
  );
}
