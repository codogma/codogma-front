'use client';
import { Grid2 as Grid } from '@mui/material';
import Container from '@mui/material/Container';
import { ThemeProviderProps } from '@mui/material/styles/ThemeProvider';
import { useParams, usePathname } from 'next/navigation';
import { Session } from 'next-auth';
import React, { ReactNode } from 'react';

import { CustomBottomNavigation } from '@/components/CustomBottomNavigation';
import Footer from '@/components/Footer';
import { NavBar } from '@/components/NavBar';
import { useNavigation } from '@/components/NavigationProvider';
import { NavPanel } from '@/components/NavPanel';
import { NavSidebar } from '@/components/NavSidebar';
import { Language } from '@/types';

type NavigationProps = {
  readonly lang: Language;
  readonly children: ReactNode;
  readonly session: Session | null;
  readonly theme: ThemeProviderProps['defaultMode'];
};

export const Navigation = ({
  lang,
  session,
  children,
  theme,
}: NavigationProps) => {
  const { isFullscreen } = useNavigation();
  const pathname = usePathname();
  const { articleId } = useParams();
  const hasAdmin = pathname.startsWith(`/${lang}/admin`);

  if (hasAdmin) {
    return children;
  }

  return (
    <>
      {!isFullscreen && <NavBar lang={lang} session={session} theme={theme} />}
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
              <NavSidebar lang={lang} />
            </Grid>
          )}
        </Grid>
      </Container>
      {!isFullscreen && <CustomBottomNavigation lang={lang} />}
    </>
  );
};
