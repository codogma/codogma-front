import {
  Box,
  Container,
  CssBaseline,
  StyledEngineProvider,
} from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import React, { ReactNode, Suspense } from 'react';

import { initTranslation } from '@/app/i18n';
import { AuthProvider } from '@/components/AuthProvider';
import ButtomNavigation from '@/components/BottomNavigation';
import { ContentImageProvider } from '@/components/ContentImageProvider';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import { NavPanel } from '@/components/NavPanel';
import NavTabs, { TabProps } from '@/components/NavTabs';
import { ReactQueryProvider } from '@/components/ReactQueryProvider';
import { Spinner } from '@/components/Spinner';
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
  const { t } = await initTranslation(lng);
  const tabs: TabProps[] = [
    { label: `${t('articles')}`, href: `/${lng}/articles` },
    { label: `${t('categories')}`, href: `/${lng}/categories` },
    { label: `${t('users')}`, href: `/${lng}/users` },
  ];

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
                    <Container maxWidth='xl' className='flex'>
                      <NavPanel />
                      <main className='grow px-3'>
                        <NavTabs tabs={tabs} />
                        <Suspense fallback={<Spinner />}>
                          <ContentImageProvider>
                            {children}
                          </ContentImageProvider>
                        </Suspense>
                      </main>
                    </Container>
                    <Footer />
                    <ButtomNavigation />
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
