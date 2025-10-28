'use client';
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import React, { useEffect, useId, useMemo, useState } from 'react';
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

const sanitizeId = (raw: string, prefix = 'swiper') => {
  const id = raw.replace(/[^A-Za-z0-9]/g, '');
  return `${prefix}-${id}`;
};

export const Carousel = ({
  lang,
  articles,
  isLoading,
  isMinimalSlides,
}: CarouselProps) => {
  const rawPrev = useId();
  const rawNext = useId();

  const prevId = useMemo(() => sanitizeId(rawPrev, 'carousel-prev'), [rawPrev]);
  const nextId = useMemo(() => sanitizeId(rawNext, 'carousel-next'), [rawNext]);
  const minForLoop = 3;

  const [navigation, setNavigation] = useState<
    { prevEl: string; nextEl: string } | false
  >(false);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(() => {
      setNavigation({ prevEl: `#${prevId}`, nextEl: `#${nextId}` });
    }, 0);

    return () => clearTimeout(timer);
  }, [prevId, nextId]);

  return articles?.length !== 0 && !isLoading ? (
    <div className='carousel-container'>
      <div
        id={prevId}
        className={`swiper-button-custom ${!isClient || !navigation ? 'swiper-button-disabled' : ''}`}
      >
        <NavigateBeforeRoundedIcon />
      </div>
      <Swiper
        modules={[Autoplay, Navigation]}
        pagination={{ clickable: true }}
        navigation={navigation}
        autoplay={
          isClient
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
          (article, index) => (
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
        className={`swiper-button-custom ${!isClient || !navigation ? 'swiper-button-disabled' : ''}`}
      >
        <NavigateNextRoundedIcon />
      </div>
    </div>
  ) : null;
};
