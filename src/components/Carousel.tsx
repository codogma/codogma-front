'use client';
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { useId } from 'react';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { ArticleCard } from '@/components/ArticleCard';
import { GetArticle, Language } from '@/types';

type CarouselProps = {
  readonly lang: Language;
  readonly articles: GetArticle[] | [];
  readonly isLoading: boolean;
  readonly isMinimalSlides?: boolean;
};

export const Carousel = ({
  lang,
  articles,
  isLoading,
  isMinimalSlides,
}: CarouselProps) => {
  const uniqueId = useId();
  const prevId = `carousel-prev-${uniqueId}`;
  const nextId = `carousel-next-${uniqueId}`;

  const minForLoop = 3;

  return articles?.length !== 0 && !isLoading ? (
    <div
      id={`carousel-${uniqueId}`}
      suppressHydrationWarning
      className='carousel-container'
    >
      <div
        id={prevId}
        suppressHydrationWarning
        className={`swiper-button-custom ${isLoading ? '' : 'swiper-button-disabled'}`}
      >
        <NavigateBeforeRoundedIcon />
      </div>
      <Swiper
        id={uniqueId}
        itemID={uniqueId}
        suppressHydrationWarning
        modules={[Autoplay, Navigation]}
        pagination={{ clickable: true }}
        navigation={{
          prevEl: `#${prevId}`,
          nextEl: `#${nextId}`,
        }}
        autoplay={
          !isLoading
            ? {
                delay: 20000,
                disableOnInteraction: false,
              }
            : false
        }
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 16,
          },
          900: {
            slidesPerView: 2,
            spaceBetween: 16,
          },
          1200: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1536: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
        }}
        watchOverflow={true}
        watchSlidesProgress={true}
        className='swiper'
      >
        {(isLoading ? Array.from(new Array(minForLoop)) : articles)?.map(
          (article: GetArticle, index) => (
            <SwiperSlide
              key={article ? article.id : `skeleton-${index}`}
              className={index === 0 && isMinimalSlides ? 'first-slide' : ''}
            >
              <ArticleCard
                article={article}
                lang={lang}
                isMinimal={isMinimalSlides}
              />
            </SwiperSlide>
          ),
        )}
      </Swiper>
      <div
        id={nextId}
        suppressHydrationWarning
        className={`swiper-button-custom ${isLoading ? '' : 'swiper-button-disabled'}`}
      >
        <NavigateNextRoundedIcon />
      </div>
    </div>
  ) : null;
};
