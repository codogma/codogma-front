import {
  Box,
  Container,
  CssBaseline,
  Grid2 as Grid,
  StyledEngineProvider,
} from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import React, { ReactNode } from 'react';

import { initTranslation } from '@/app/i18n';
import { AuthProvider } from '@/components/AuthProvider';
import BottomNavigation from '@/components/BottomNavigation';
import ButtonBackToTop from '@/components/ButtonBackToTop';
import { ContentImageProvider } from '@/components/ContentImageProvider';
import CustomizedSnackbars from '@/components/CustomizedSnackbars';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import { NavPanel } from '@/components/NavPanel';
import { ReactQueryProvider } from '@/components/ReactQueryProvider';
import { ColorModeProvider } from '@/components/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

type RootLayoutProps = {
  readonly children: ReactNode;
  readonly params: { lng: string };
};

export async function generateMetadata({
  params: { lng },
}: RootLayoutProps): Promise<Metadata> {
  const { t } = await initTranslation(lng, 'main');
  return {
    metadataBase: new URL('https://codogma.com'),
    alternates: {
      canonical: `/`,
      languages: {
        en: `/en`,
        ru: `/ru`,
      },
    },
    title: {
      template: '%s | CODOGMA',
      default: `${t('title')} | CODOGMA`,
    },
    description: t('description'),
    applicationName: 'CODOGMA',
    appLinks: {
      web: {
        url: 'https://codogma.com',
        should_fallback: true,
      },
    },
    robots: {
      index: true,
      follow: true,
      nocache: true,
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}

export default async function RootLayout({
  children,
  params: { lng },
}: RootLayoutProps) {
  return (
    <html lang={lng}>
      <body className={inter.className}>
        <StyledEngineProvider injectFirst>
          <AppRouterCacheProvider>
            <ColorModeProvider>
              <ReactQueryProvider>
                <AuthProvider>
                  <CssBaseline />
                  <Box className='flex min-h-screen flex-col'>
                    <NavBar lang={lng} />
                    <Container maxWidth='xl' className='grid'>
                      <Grid container spacing={2} rowGap={0}>
                        <Grid size={{ lg: 2, md: 1, sm: 0 }}>
                          <NavPanel lang={lng} />
                        </Grid>
                        <Grid size={{ lg: 10, md: 11, sm: 12 }}>
                          <ButtonBackToTop>
                            <main className='grow'>
                              <ContentImageProvider>
                                {children}
                              </ContentImageProvider>
                            </main>
                          </ButtonBackToTop>
                          <Footer />
                        </Grid>
                      </Grid>
                      <CustomizedSnackbars />
                    </Container>
                    <BottomNavigation lang={lng} />
                  </Box>
                </AuthProvider>
              </ReactQueryProvider>
            </ColorModeProvider>
          </AppRouterCacheProvider>
        </StyledEngineProvider>
      </body>
    </html>
  );
}
