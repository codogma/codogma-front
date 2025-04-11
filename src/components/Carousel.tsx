'use client';
import { Box, CardActions, CardHeader, Skeleton } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
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

export const Carousel = ({
  lang,
  articles: data,
  isLoading,
}: CarouselProps) => {
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
      {isLoading
        ? Array(3)
            .fill(null)
            .map((_, index) => (
              <SwiperSlide key={`skeleton-${index}`}>
                <Box sx={{ backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                  <Card variant='outlined' className='card'>
                    <CardHeader
                      avatar={
                        <Skeleton
                          variant='rectangular'
                          width={32}
                          height={32}
                          sx={{ borderRadius: 1 }}
                        />
                      }
                      action={
                        <Skeleton variant='circular' width={32} height={32} />
                      }
                      title={
                        <Skeleton
                          variant='text'
                          width={80}
                          height={24}
                          sx={{ fontSize: '1rem' }}
                        />
                      }
                      subheader={
                        <Skeleton
                          variant='text'
                          width={100}
                          height={20}
                          sx={{ fontSize: '0.875rem' }}
                        />
                      }
                      className='card-header'
                    />
                    <CardContent className='card-content'>
                      <Skeleton
                        variant='text'
                        width='80%'
                        height={32}
                        sx={{ fontSize: '1.5rem', mb: 2 }}
                      />
                      <Stack direction='row' spacing={1} sx={{ mb: 2 }}>
                        {[1, 2, 3].map((n) => (
                          <Skeleton
                            key={n}
                            variant='text'
                            width={70}
                            height={24}
                            sx={{ borderRadius: 4 }}
                          />
                        ))}
                      </Stack>
                      <Skeleton variant='text' width='100%' height={20} />
                      <Skeleton variant='text' width='90%' height={20} />
                      <Skeleton
                        variant='text'
                        width='85%'
                        height={20}
                        sx={{ mb: 2 }}
                      />
                    </CardContent>
                    <CardActions sx={{ px: 2, pb: 2 }}>
                      <Skeleton variant='rounded' width={120} height={36} />
                    </CardActions>
                  </Card>
                </Box>
              </SwiperSlide>
            ))
        : data?.map((item, index) => (
            <SwiperSlide key={index}>
              <Box sx={{ backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                <ArticleCard article={item} lang={lang} />
              </Box>
            </SwiperSlide>
          ))}
    </Swiper>
  );
};
