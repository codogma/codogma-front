import { Container, StyledEngineProvider } from '@mui/material';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import React, { ReactNode } from 'react';

import '@/app/globals.css';

import { ButtonBackToTop } from '@/components/ButtonBackToTop';
import { ContentImageProvider } from '@/components/ContentImageProvider';
import { CustomizedSnackbars } from '@/components/CustomizedSnackbars';
import { Navigation } from '@/components/Navigation';
import { NavigationProvider } from '@/components/NavigationProvider';
import { PlatformProvider } from '@/components/PlatformProvider';
import { ReactQueryProvider } from '@/components/ReactQueryProvider';
import { ColorModeProvider } from '@/components/ThemeContext';
import { themeConfig } from '@/constants/theme-config';
import { getTheme } from '@/helpers/getTheme';
import { auth } from '@/lib/auth';
import { Language } from '@/types';
import { detectPlatform } from '@/utils/platform';

const inter = Inter({ subsets: ['latin'] });

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: Promise<{ lng: string }>;
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

export default async function Layout({ children, params }: LayoutProps) {
  const { lng } = await params;
  const lang = lng as Language;
  const session = await auth();
  const theme = (await getTheme()) || themeConfig.defaultDarkColorScheme;

  // Определение платформы на сервере
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const platform = detectPlatform(userAgent);

  return (
    <html lang={lang} suppressHydrationWarning data-scroll-behavior='smooth'>
      <body className={inter.className}>
        <InitColorSchemeScript
          attribute={themeConfig.attribute}
          modeStorageKey={themeConfig.modeStorageKey}
          colorSchemeStorageKey={themeConfig.colorSchemeStorageKey}
          defaultMode={themeConfig.defaultMode}
          defaultLightColorScheme={themeConfig.defaultLightColorScheme}
          defaultDarkColorScheme={themeConfig.defaultDarkColorScheme}
        />
        <StyledEngineProvider injectFirst>
          <AppRouterCacheProvider>
            <ColorModeProvider>
              <PlatformProvider platform={platform}>
                <ReactQueryProvider>
                  <SessionProvider session={session}>
                    {/*<WebSocketProvider>*/}
                    <NextIntlClientProvider locale={lng}>
                      <NavigationProvider>
                        <Navigation lang={lang} session={session} theme={theme}>
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
              </PlatformProvider>
            </ColorModeProvider>
          </AppRouterCacheProvider>
        </StyledEngineProvider>
      </body>
    </html>
  );
}
