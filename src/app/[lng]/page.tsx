'use client';
import { Box } from '@mui/material';
import { TabOwnProps } from '@mui/material/Tab/Tab';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import Banner from '@/components/Banner';
import { Carousel } from '@/components/Carousel';
import { MainTabs } from '@/components/MainTabs';
import { getArticles, GetArticlesDTO } from '@/helpers/articleApi';
import { Language } from '@/types';

type PageProps = {
  readonly params: { lng: Language; icon: TabOwnProps['icon'] };
};

export default function Page({ params: { lng, icon } }: PageProps) {
  const { state } = useAuth();
  const { t } = useTranslation(lng, 'main');

  const { data: recentlyData, isFetching: isFetchingRecently } =
    useQuery<GetArticlesDTO>({
      queryKey: ['recentlyArticles'],
      queryFn: () => {
        return getArticles(undefined, undefined, 0, 5);
      },
    });

  const recentlyAdded = recentlyData?.content ?? [];

  return (
    <section>
      <Banner
        bannerData={{ welcome: t('welcome'), subWelcome: t('subWelcome') }}
      />
      {state.isAuthenticated && (
        <section className='your-interest'>
          <Typography variant='h3' className='your-interest-h3'>
            {t('yourInterests')}
          </Typography>
          <MainTabs lang={lng} icon={icon} username={state.user?.username} />
        </section>
      )}
      <Box sx={{ width: 'auto', margin: 'auto', padding: '20px 0' }}>
        <Typography variant='h5' gutterBottom>
          {t('recentlyAdded')}
        </Typography>
        <Carousel
          articles={recentlyAdded}
          isLoading={isFetchingRecently}
          lang={lng}
        />
      </Box>
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
