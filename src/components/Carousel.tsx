'use client';
import { Box, Skeleton } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid2';
import React from 'react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ArticleCard } from '@/components/ArticleCard';
import { GetArticle, Language } from '@/types';

type CarouselProps = {
  readonly lang: Language;
  readonly articles: GetArticle[];
  readonly isLoading: boolean;
};

export const Carousel = ({ lang, articles, isLoading }: CarouselProps) => {
  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      spaceBetween={30}
      slidesPerView={'auto'}
      navigation={true}
      pagination={{ clickable: true }}
      autoplay={{
        delay: 20000,
        disableOnInteraction: false,
      }}
      loop={true}
      className='swiper'
    >
      <Grid container spacing={2}>
        {(isLoading ? Array.from(new Array(4)) : articles)?.map(
          (article, index) => (
            <Grid key={article?.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              {article ? (
                articles?.map((article, index) => (
                  <SwiperSlide key={`skeleton-${index}`}>
                    <Box sx={{ backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                      <ArticleCard article={article} lang={lang} />
                    </Box>
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide key={`skeleton-${index}`}>
                  <Box sx={{ backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                    <Card variant='outlined' className='card'>
                      <CardContent>
                        <div
                          style={{
                            display: 'flex',
                            gap: 16,
                            alignItems: 'center',
                          }}
                        >
                          <Skeleton
                            animation='wave'
                            variant='rounded'
                            width={40}
                            height={40}
                          />
                          <div style={{ flex: 1 }}>
                            <Skeleton
                              animation='wave'
                              height={10}
                              width='80%'
                              style={{ marginBottom: 6 }}
                            />
                            <Skeleton
                              animation='wave'
                              height={10}
                              width='40%'
                            />
                          </div>
                        </div>
                      </CardContent>
                      <Skeleton
                        sx={{ height: 190 }}
                        animation='wave'
                        variant='rectangular'
                      />
                      <CardContent>
                        <Skeleton
                          animation='wave'
                          height={10}
                          style={{ marginBottom: 6 }}
                        />
                        <Skeleton animation='wave' height={10} width='80%' />
                      </CardContent>
                    </Card>
                  </Box>
                </SwiperSlide>
              )}
            </Grid>
          ),
        )}
      </Grid>
    </Swiper>
  );
};
