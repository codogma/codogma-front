'use client';
import { Container, Grid2 as Grid } from '@mui/material';
import { useParams, usePathname } from 'next/navigation';
import { Session } from 'next-auth';
import React, { ReactNode } from 'react';

import { CustomBottomNavigation } from '@/components/CustomBottomNavigation';
import Footer from '@/components/Footer';
import { NavBar } from '@/components/NavBar';
import { useNavigationState } from '@/components/NavigationProvider';
import { NavPanel } from '@/components/NavPanel';
import { NavSidebar } from '@/components/NavSidebar';
import { Language } from '@/types';

type NavigationProps = {
  readonly lang: Language;
  readonly children: ReactNode;
  readonly session: Session | null;
};

export const Navigation = ({ lang, session, children }: NavigationProps) => {
  const { article, toc, isFullscreen } = useNavigationState();
  const pathname = usePathname();
  const { articleId } = useParams();
  const hasAdmin = pathname.startsWith(`/${lang}/admin`);

  if (hasAdmin) {
    return children;
  }

  return (
    <>
      {!isFullscreen && <NavBar lang={lang} session={session} />}
      <Container maxWidth='xl'>
        <Grid container spacing={1} direction='row' columns={12}>
          <Grid
            sx={{
              position: 'sticky',
              top: 64,
              height: { xs: 'auto', md: 'calc(100vh - 64px)' },
              overflow: 'hidden',
              display: { xs: 'none', md: isFullscreen ? 'none' : 'block' },
            }}
          >
            <NavPanel lang={lang} />
          </Grid>
          <Grid
            size={{ md: 'grow', xs: 12 }}
            columnGap={1}
            className='flex flex-col flex-wrap justify-between'
          >
            {children}
            {!isFullscreen && <Footer lang={lang} />}
          </Grid>
          {!!articleId && (
            <Grid
              sx={{
                position: 'sticky',
                top: 64,
                height: { xs: 'auto', md: 'calc(100vh - 64px)' },
                overflow: 'hidden',
                display: { xs: 'none', md: isFullscreen ? 'none' : 'block' },
              }}
            >
              <NavSidebar lang={lang} article={article} toc={toc} />
            </Grid>
          )}
        </Grid>
      </Container>
      {!isFullscreen && <CustomBottomNavigation lang={lang} />}
    </>
  );
};
