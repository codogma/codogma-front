'use client';
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
  const minForLoop = 4;
  const enableLoop = !isLoading && articles.length >= minForLoop;
  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      spaceBetween={16}
      slidesPerView='auto'
      navigation={true}
      pagination={{ clickable: true }}
      autoplay={{
        delay: 20000,
        disableOnInteraction: false,
      }}
      loop={enableLoop}
      className='swiper'
    >
      {(isLoading ? Array.from(new Array(4)) : articles)?.map(
        (article, index) => (
          <SwiperSlide key={article ? article.id : `skeleton-${index}`}>
            <ArticleCard article={article} lang={lang} />
          </SwiperSlide>
        ),
      )}
    </Swiper>
  );
};
