'use client';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import NewReleasesRoundedIcon from '@mui/icons-material/NewReleasesRounded';
import StarsRoundedIcon from '@mui/icons-material/StarsRounded';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import {
  DehydratedState,
  HydrationBoundary,
  useQuery,
} from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { BannerCarousel } from '@/components/BannerCarousel';
import { Carousel } from '@/components/Carousel';
import { Categories } from '@/components/Categories';
import { MainTabs } from '@/components/MainTabs';
import { getArticles, GetArticlesDTO } from '@/helpers/articleApi';
import { getCategories, GetCategoriesDTO } from '@/helpers/categoryApi';
import { Language } from '@/types';

interface MainPageClientProps {
  readonly dehydratedState: DehydratedState;
  readonly lng: Language;
  readonly initialRecentlyAdded?: GetArticlesDTO;
}

export const MainPage = ({
  dehydratedState,
  lng,
  initialRecentlyAdded,
}: MainPageClientProps) => {
  const t = useTranslations('mainPage');
  const { data: clientSession, status } = useSession();
  const [isClient, setIsClient] = useState(false);

  const isAuthorized = !!clientSession?.user;

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Запрос популярных категорий (топ-6)
  const { data: popularCategoriesData, isPending: isCategoriesLoading } =
    useQuery<GetCategoriesDTO>({
      queryKey: ['popularCategories', lng],
      queryFn: () =>
        getCategories(undefined, undefined, false, 0, 6, 'createdAt', 'desc'),
      staleTime: 5 * 60 * 1000, // Кэшируем на 5 минут
    });

  const popularCategories = popularCategoriesData?.content ?? [];

  // Запрос рекомендаций для авторизованных пользователей
  const { data: recommendedArticlesData, isPending: isRecommendedLoading } =
    useQuery<GetArticlesDTO>({
      queryKey: ['recommendedArticles', clientSession?.user?.name],
      queryFn: () => getArticles(undefined, undefined, 0, 12),
      enabled: !!clientSession?.user,
      staleTime: 2 * 60 * 1000,
    });

  const recommendedArticles = recommendedArticlesData?.content ?? [];

  // Запрос недавних статей (уже есть в initialData)
  const { data: recentlyAddedData, isPending: isRecentlyLoading } =
    useQuery<GetArticlesDTO>({
      queryKey: ['recentlyArticles'],
      queryFn: () => getArticles(undefined, undefined, 0, 10),
      initialData: initialRecentlyAdded,
      staleTime: 60 * 1000,
    });

  const recentlyArticles = recentlyAddedData?.content ?? [];

  const shouldShowInterests =
    isClient && status === 'authenticated' && isAuthorized;

  return (
    <HydrationBoundary state={dehydratedState}>
      <Box className='page-stack'>
        {/* Баннер */}
        <section className='section'>
          <BannerCarousel
            articles={recentlyArticles}
            lang={lng}
            isLoading={isRecentlyLoading}
          />
        </section>

        {/* Популярные категории */}
        <section className='section'>
          <div className='section-head'>
            <Typography component='h2' className='section-title'>
              <StarsRoundedIcon fontSize='small' />
              {t('popularCategories')}
            </Typography>
          </div>
          <div className='section-divider' />
          <div className='section-surface section-pad'>
            <Categories
              categories={popularCategories}
              isLoading={isCategoriesLoading}
              categoriesPerPageStart={6}
              lang={lng}
              refetch={() => {}}
            />
          </div>
        </section>

        {/* Ваши интересы (только для авторизованных) */}
        {shouldShowInterests && (
          <section className='section'>
            <div className='section-head'>
              <Typography component='h2' className='section-title'>
                <FavoriteRoundedIcon fontSize='small' />
                {t('yourInterests')}
              </Typography>
            </div>
            <div className='section-divider' />
            <div className='section-surface section-pad'>
              <MainTabs lang={lng} username={clientSession.user.name} />
            </div>
          </section>
        )}

        {/* Рекомендации для вас (только для авторизованных) */}
        {shouldShowInterests &&
          (isRecommendedLoading || recommendedArticles.length > 0) && (
            <section className='section'>
              <div className='section-head'>
                <Typography component='h2' className='section-title'>
                  <AutoAwesomeRoundedIcon fontSize='small' />
                  {t('recommendedForYou')}
                </Typography>
              </div>
              <div className='section-divider' />
              <Carousel
                lang={lng}
                articles={recommendedArticles}
                isLoading={isRecommendedLoading}
              />
            </section>
          )}

        {/* Недавно добавленные */}
        <section className='section'>
          <div className='section-head'>
            <Typography component='h2' className='section-title'>
              <NewReleasesRoundedIcon fontSize='small' />
              {t('recentlyAdded')}
            </Typography>
          </div>
          <div className='section-divider' />
          <Carousel
            lang={lng}
            articles={recentlyArticles}
            isLoading={isRecentlyLoading}
          />
        </section>
      </Box>
    </HydrationBoundary>
  );
};
