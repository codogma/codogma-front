import { Container, CssBaseline, StyledEngineProvider } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import React, { ReactNode } from 'react';

import { initTranslation } from '@/app/i18n';
import { AuthProvider } from '@/components/AuthProvider';
import ButtonBackToTop from '@/components/ButtonBackToTop';
import { ContainerWithNavigations } from '@/components/ContainerWithNavigations';
import { ContentImageProvider } from '@/components/ContentImageProvider';
import { CustomizedSnackbars } from '@/components/CustomizedSnackbars';
import Footer from '@/components/Footer';
import { ReactQueryProvider } from '@/components/ReactQueryProvider';
import { ColorModeProvider } from '@/components/ThemeContext';
import { Language } from '@/types';

const inter = Inter({ subsets: ['latin'] });

type RootLayoutProps = {
  readonly children: ReactNode;
  readonly params: { lng: Language };
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

export default async function Layout({
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
                  <ContainerWithNavigations lang={lng}>
                    <ButtonBackToTop>
                      <Container className='content'>
                        <ContentImageProvider>{children}</ContentImageProvider>
                      </Container>
                    </ButtonBackToTop>
                    <Footer lang={lng} />
                    <CustomizedSnackbars />
                  </ContainerWithNavigations>
                </AuthProvider>
              </ReactQueryProvider>
            </ColorModeProvider>
          </AppRouterCacheProvider>
        </StyledEngineProvider>
      </body>
    </html>
  );
}
