import { Container, StyledEngineProvider } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { Metadata } from 'next';
import '@/app/globals.css';
import { Inter } from 'next/font/google';
import React, { ReactNode } from 'react';

import { getT } from '@/app/i18n';
import { AuthProvider } from '@/components/AuthProvider';
import { ButtonBackToTop } from '@/components/ButtonBackToTop';
import { ContentImageProvider } from '@/components/ContentImageProvider';
import { CustomizedSnackbars } from '@/components/CustomizedSnackbars';
import { Navigation } from '@/components/Navigation';
import { NavigationProvider } from '@/components/NavigationProvider';
import { ReactQueryProvider } from '@/components/ReactQueryProvider';
import { ColorModeProvider } from '@/components/ThemeContext';
import { Language } from '@/types';

const inter = Inter({ subsets: ['latin'] });

type RootLayoutProps = {
  readonly children: ReactNode;
  readonly params: { lng: Language };
};

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT('main');
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

export default async function Layout({
  children,
  params: { lng },
}: RootLayoutProps) {
  return (
    <html lang={lng} suppressHydrationWarning>
      <body className={inter.className}>
        <StyledEngineProvider injectFirst>
          <AppRouterCacheProvider>
            <ColorModeProvider>
              <ReactQueryProvider>
                <AuthProvider>
                  <NavigationProvider>
                    <Navigation lang={lng}>
                      <ButtonBackToTop>
                        <Container className='content'>
                          <ContentImageProvider>
                            {children}
                          </ContentImageProvider>
                        </Container>
                      </ButtonBackToTop>
                      <CustomizedSnackbars />
                    </Navigation>
                  </NavigationProvider>
                </AuthProvider>
              </ReactQueryProvider>
            </ColorModeProvider>
          </AppRouterCacheProvider>
        </StyledEngineProvider>
      </body>
    </html>
  );
}
