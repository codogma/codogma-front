import { Container, StyledEngineProvider } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { Metadata } from 'next';
import '@/app/globals.css';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import React, { ReactNode } from 'react';

import { ButtonBackToTop } from '@/components/ButtonBackToTop';
import { ContentImageProvider } from '@/components/ContentImageProvider';
import { CustomizedSnackbars } from '@/components/CustomizedSnackbars';
import { Navigation } from '@/components/Navigation';
import { NavigationProvider } from '@/components/NavigationProvider';
import { ReactQueryProvider } from '@/components/ReactQueryProvider';
import { ColorModeProvider } from '@/components/ThemeContext';
import { auth } from '@/lib/auth';
import { Language } from '@/types';

const inter = Inter({ subsets: ['latin'] });

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: { lng: Language };
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('mainPage');
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
}: LayoutProps) {
  const session = await auth();
  return (
    <html lang={lng}>
      <body className={inter.className}>
        <StyledEngineProvider injectFirst>
          <AppRouterCacheProvider>
            <ColorModeProvider>
              <ReactQueryProvider>
                <SessionProvider session={session}>
                  {/*<WebSocketProvider>*/}
                  <NextIntlClientProvider locale={lng}>
                    <NavigationProvider>
                      <Navigation lang={lng} session={session}>
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
                  </NextIntlClientProvider>
                  {/*</WebSocketProvider>*/}
                </SessionProvider>
              </ReactQueryProvider>
            </ColorModeProvider>
          </AppRouterCacheProvider>
        </StyledEngineProvider>
      </body>
    </html>
  );
}
