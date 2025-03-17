'use client';
import Typography from '@mui/material/Typography';
import React from 'react';

import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import Banner from '@/components/Banner';
import Carousel from '@/components/Carousel';
import { MainTabs } from '@/components/MainTabs';
import { Language } from '@/types';

type PageProps = {
  readonly params: { lng: Language };
};

export default function Page({ params: { lng } }: PageProps) {
  const { state } = useAuth();
  const { t } = useTranslation(lng, 'main');

  return (
    <section>
      <Banner
        bannerData={{ welcome: t('welcome'), subWelcome: t('subWelcome') }}
      />
      {state.isAuthenticated && (
        <section className='your-interest'>
          <Typography variant='h3' className='your-interest-h3'>
            Your interest
          </Typography>
          <MainTabs lang={lng} />
        </section>
      )}
      <Carousel />
      {/*<Carousel/>*/}
      {/*<Carousel/>*/}
      {/*<section className="carousels-section">*/}
      {/*    <section className="recommended">*/}
      {/*        <Typography variant="h3">Recommended for you</Typography>*/}
      {/*    </section>*/}
      {/*    <section className="popular">*/}
      {/*        <Typography variant="h3">Most popular</Typography>*/}
      {/*    </section>*/}
      {/*</section>*/}
    </section>
  );
}
