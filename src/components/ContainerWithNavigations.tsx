'use client';
import { Container, Grid2 as Grid } from '@mui/material';
import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react';

import BottomNavigation from '@/components/BottomNavigation';
import NavBar from '@/components/NavBar';
import { NavPanel } from '@/components/NavPanel';
import { Language } from '@/types';

type ContainerWithNavPanelProps = {
  readonly lang: Language;
  readonly children: ReactNode;
};

export const ContainerWithNavigations = ({
  lang,
  children,
}: ContainerWithNavPanelProps) => {
  const pathname = usePathname();
  const hasAdmin = pathname.startsWith(`/${lang}/admin`);
  if (hasAdmin) {
    return children;
  }
  return (
    <>
      <NavBar lang={lang} />
      <Container maxWidth='xl'>
        <Grid container spacing={1} rowGap={0} direction='row' columns={12}>
          <Grid
            size={{ md: 'auto', xs: 0 }}
            sx={{
              position: 'sticky',
              top: 64,
              height: { xs: 'auto', md: 'calc(100vh - 64px)' },
              overflow: 'hidden',
            }}
          >
            <NavPanel lang={lang} />
          </Grid>
          <Grid
            size={{ md: 'grow', xs: 12 }}
            className='flex flex-col flex-wrap justify-between'
          >
            {children}
          </Grid>
        </Grid>
      </Container>
      <BottomNavigation lang={lang} />
    </>
  );
};
