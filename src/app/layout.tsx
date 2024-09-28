import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { Box, CssBaseline, StyledEngineProvider } from '@mui/material';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/NavBar';
import { AuthProvider } from '@/components/AuthProvider';
import { ColorModeProvider } from '@/components/ThemeContext';
import Container from '@mui/material/Container';
import React, { ReactNode, Suspense } from 'react';
import NavTabs from '@/components/NavTabs';
import Footer from '@/components/Footer';
import { ReactQueryProvider } from '@/components/ReactQueryProvider';
import Spinner from '@/app/loading';
import { ContentImageProvider } from '@/components/ContentImageProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
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
    default: 'Main | CODOGMA',
  },
  description: 'Main page of CODOGMA',
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <StyledEngineProvider injectFirst>
          <AppRouterCacheProvider>
            <ColorModeProvider>
              <ReactQueryProvider>
                <AuthProvider>
                  <CssBaseline />
                  <Box className='flex min-h-screen flex-col'>
                    <NavBar />
                    <Container maxWidth='lg' className='relative flex-auto'>
                      <NavTabs />
                      <Suspense fallback={<Spinner />}>
                        <ContentImageProvider>{children}</ContentImageProvider>
                      </Suspense>
                    </Container>
                    <Footer />
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
