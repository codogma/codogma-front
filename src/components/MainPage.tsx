'use client';
import NewReleasesRoundedIcon from '@mui/icons-material/NewReleasesRounded';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import {
  DehydratedState,
  HydrationBoundary,
  useQuery,
} from '@tanstack/react-query';
import { Session } from 'next-auth';
import { useTranslations } from 'next-intl';

import { BannerCarousel } from '@/components/BannerCarousel';
import { Carousel } from '@/components/Carousel';
import { MainTabs } from '@/components/MainTabs';
import { getArticles, GetArticlesDTO } from '@/helpers/articleApi';
import { Language } from '@/types';

interface MainPageClientProps {
  readonly dehydratedState: DehydratedState;
  readonly lng: Language;
  readonly initialRecentlyAdded?: GetArticlesDTO;
  readonly session: Session | null;
}

export const MainPage = ({
  dehydratedState,
  lng,
  initialRecentlyAdded,
  session,
}: MainPageClientProps) => {
  const t = useTranslations('mainPage');

  const { data: recentlyAddedData, isLoading } = useQuery<GetArticlesDTO>({
    queryKey: ['recentlyArticles'],
    queryFn: () => getArticles(undefined, undefined, 0, 10),
    initialData: initialRecentlyAdded,
  });

  const recentlyArticles = recentlyAddedData?.content ?? [];

  return (
    <HydrationBoundary state={dehydratedState}>
      <main>
        <section>
          <BannerCarousel
            articles={recentlyArticles}
            isLoading={isLoading}
            lang={lng}
          />
        </section>
        {session?.user && (
          <section className='your-interest'>
            <Typography variant='h3' className='your-interest-h3'>
              {t('yourInterests')}
            </Typography>
            <MainTabs lang={lng} username={session.user?.name} />
          </section>
        )}
        <section>
          <Box sx={{ width: 'auto', margin: 'auto', padding: '20px 0' }}>
            <section className='your-interest'>
              <Typography
                variant='h3'
                className='your-interest-h3'
                gutterBottom
              >
                <NewReleasesRoundedIcon
                  sx={{ width: 40, height: 40, color: 'blue' }}
                />
                {t('recentlyAdded')}
              </Typography>
            </section>
            <Carousel
              articles={recentlyArticles}
              isLoading={isLoading}
              lang={lng}
            />
          </Box>
        </section>
      </main>
    </HydrationBoundary>
  );
};
