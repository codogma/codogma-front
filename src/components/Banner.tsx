'use client';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import InsightsIcon from '@mui/icons-material/Insights';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Box, Divider, Paper, Skeleton, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

import { Carousel } from '@/components/Carousel';
import { DefaultImage } from '@/components/DefaultImage';
import { devConsoleInfo } from '@/helpers/devConsoleLogs';
import { GetArticle, Language, SwatchDTO } from '@/types';

type BannerProps = {
  readonly articles: GetArticle[] | [];
  readonly lang: Language;
  readonly isLoading: boolean;
};

export const Banner = ({ articles, lang, isLoading }: BannerProps) => {
  const pathname = usePathname();
  let urlPrefix = '';
  if (pathname.includes('compilations')) {
    urlPrefix = pathname;
  } else {
    urlPrefix = `/${lang}/articles`;
  }

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const count = articles?.length ?? 0;

  const t = useTranslations('mainPage');
  devConsoleInfo(articles);

  const firstTopArticle = articles[0];

  const clampIndex = (idx: number) =>
    Math.max(0, Math.min((count || 1) - 1, idx));
  const active = count ? articles[clampIndex(activeIndex)] : firstTopArticle;

  const activePalette = active?.image?.palette;
  const activeVibrant = (activePalette?.vibrant || {}) as SwatchDTO;
  const {
    r: activeR = 0,
    g: activeG = 0,
    b: activeB = 0,
    titleTextColor: activeTextColor = '#fff',
  } = activeVibrant;

  useEffect(() => {
    // Если пауза, загрузка или статей мало — не запускаем таймер
    if (isPaused || isLoading || count <= 1) return;

    const timer = setInterval(() => {
      // Переключаем на следующий слайд (циклично, только среди видимых 6 штук)
      setActiveIndex((prev) => (prev + 1) % Math.min(count, 6));
    }, 7000);

    return () => clearInterval(timer);
  }, [isPaused, isLoading, count, activeIndex]);

  const palette = firstTopArticle?.image?.palette;

  const vibrant = (palette?.vibrant || {}) as SwatchDTO;
  const {
    r: vibrantR = 0,
    g: vibrantG = 0,
    b: vibrantB = 0,
    titleTextColor: vibrantTextColor = '#fff',
  } = vibrant;

  const getImgSrc = (a?: GetArticle | null) =>
    a?.image?.imageUrl
      ? `${process.env.NEXT_PUBLIC_BASE_URL}${a.image.imageUrl}`
      : '/images/banner.png';

  return (
    <section className='banner'>
      <Box
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        sx={{
          display: { xs: 'none', lg: 'grid' },
          gap: 2,
          // На lg (1200-1536) делаем более узкую правую колонку, на xl+ — как Epic
          gridTemplateColumns: {
            lg: 'minmax(0, 1fr) 280px',
            xl: 'minmax(0, 1fr) 360px',
          },
          alignItems: 'stretch',
        }}
      >
        {/* HERO */}
        <Paper
          component={Link}
          href={active?.id ? `${urlPrefix}/${active.id}` : '#'}
          variant='outlined'
          sx={{
            position: 'relative',
            borderRadius: 2,
            overflow: 'hidden',
            minHeight: { lg: 280, xl: 320 },
            maxHeight: { lg: 320, xl: 380 },
            textDecoration: 'none',
            minWidth: 0, // важно для flex/grid child
          }}
        >
          <DefaultImage
            src={getImgSrc(active)}
            position='absolute'
            priority
            style={{ inset: 0, zIndex: 0 }}
          />

          {/* overlay: затемнение слева/снизу как у Epic */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              background:
                'linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.10) 55%, rgba(0,0,0,0.0) 75%)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 2,
              p: { lg: '24px 24px 20px', xl: '32px 32px 28px' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              color: activeTextColor,
            }}
          >
            <Typography
              variant='h1'
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontSize: { lg: 18, xl: 20 },
                color: activeTextColor,
              }}
            >
              <InsightsIcon
                sx={{
                  width: { lg: 32, xl: 36 },
                  height: { lg: 32, xl: 36 },
                  color: 'yellow',
                }}
              />
              {t('popular')}
            </Typography>

            {count > 0 && (
              <Box>
                <Typography
                  variant='subtitle1'
                  className='banner-title'
                  sx={{
                    maxWidth: { lg: 520, xl: 720 },
                    lineHeight: 1.15,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    color: activeTextColor,
                  }}
                >
                  {active?.title}
                </Typography>

                <Stack
                  direction='row'
                  spacing={1}
                  divider={
                    <Divider
                      orientation='vertical'
                      sx={{
                        borderColor: activeTextColor,
                      }}
                      flexItem
                    />
                  }
                  sx={{
                    mt: 1,
                    maxWidth: 320,
                    color: activeTextColor,
                  }}
                >
                  <span className='align-center flex flex-row gap-0.5 text-xs'>
                    <VisibilityOutlinedIcon sx={{ width: 16, height: 16 }} />
                    {active?.viewsCount ?? 0}
                  </span>
                  <span className='align-center flex flex-row gap-0.5 text-xs'>
                    <ChatOutlinedIcon sx={{ width: 16, height: 16 }} />
                    {active?.commentsCount ?? 0}
                  </span>
                  <span className='align-center flex flex-row gap-0.5 text-xs'>
                    <ThumbUpOutlinedIcon sx={{ width: 16, height: 16 }} />
                    {active?.likesCount ?? 0}
                  </span>
                </Stack>
              </Box>
            )}
          </Box>

          {/* лёгкий цветовой низ (в тон картинки) */}
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: { lg: 80, xl: 100 },
              zIndex: 1,
              background: `linear-gradient(to top, rgba(${activeR}, ${activeG}, ${activeB}, 0.8) 50%, transparent)`,
            }}
          />
        </Paper>

        {/* RIGHT LIST */}
        <Paper
          variant='outlined'
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            p: { lg: 0.75, xl: 1 },
            minHeight: { lg: 280, xl: 320 },
            maxHeight: { lg: 320, xl: 380 },
            minWidth: 0, // важно
            background: 'rgba(0,0,0,0.03)',
            '.dark &': { background: 'rgba(255,255,255,0.04)' },
          }}
        >
          <Stack
            spacing={0.75}
            sx={{ overflowY: 'auto', maxHeight: { lg: 320, xl: 380 } }}
          >
            {isLoading || count === 0
              ? Array.from({ length: 5 }).map((_, idx) => (
                  <Box
                    key={`skeleton-${idx}`}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: { lg: 0.75, xl: 1.25 },
                      borderRadius: 1.5,
                      p: { lg: 0.75, xl: 1 },
                      minWidth: 0,
                    }}
                  >
                    <Skeleton
                      variant='rounded'
                      sx={{
                        width: { lg: 38, xl: 44 },
                        height: { lg: 38, xl: 44 },
                        borderRadius: 1,
                        flex: '0 0 auto',
                      }}
                    />
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Skeleton
                        variant='text'
                        sx={{ fontSize: 14, width: '80%' }}
                      />
                      <Skeleton
                        variant='text'
                        sx={{ fontSize: 12, width: '55%' }}
                      />
                    </Box>
                  </Box>
                ))
              : articles.slice(0, Math.min(count, 6)).map((a, idx) => {
                  const isActive = idx === clampIndex(activeIndex);
                  return (
                    <Box
                      key={a.id ?? idx}
                      component='button'
                      type='button'
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveIndex(idx);
                      }}
                      sx={{
                        all: 'unset',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: { lg: 0.75, xl: 1.25 },
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: 1.5,
                        // p: { lg: 0.75, xl: 1 },
                        background: isActive
                          ? 'rgba(0,0,0,0.08)'
                          : 'transparent',
                        '.dark &': {
                          background: isActive
                            ? 'rgba(255,255,255,0.10)'
                            : 'transparent',
                        },
                        transition: 'background 0.2s',
                        '&:hover': {
                          background: 'rgba(0,0,0,0.05)',
                          '.dark &': { background: 'rgba(255,255,255,0.06)' },
                        },
                        minWidth: 0,
                      }}
                    >
                      <Box
                        sx={{
                          width: { lg: 90, xl: 100 }, // Чуть шире, чтобы 16/9 смотрелось хорошо
                          aspectRatio: '16/9',
                          borderRadius: 1,
                          overflow: 'hidden',
                          flex: '0 0 auto',
                          position: 'relative',
                        }}
                      >
                        <DefaultImage src={getImgSrc(a)} />
                      </Box>

                      <Typography
                        sx={{
                          fontSize: { lg: 13, xl: 14 },
                          lineHeight: 1.2,
                          fontWeight: isActive ? 600 : 500,
                          color: 'text.primary',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          minWidth: 0,
                          textAlign: 'left',
                        }}
                      >
                        {a.title}
                      </Typography>

                      {/* Индикатор прогресса (только для активного элемента) */}
                      {isActive && (
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            height: 4, // Высота полоски
                            backgroundColor: `rgba(${activeR}, ${activeG}, ${activeB}, 0.8)`, // Цвет (можно заменить на 'white' или любой другой)
                            zIndex: 10,
                            // Анимация растягивания ширины от 0 до 100% за 7 секунд
                            animation: 'progress-loading 7s linear forwards',
                            // Если навели мышь (isPaused), анимация замирает
                            animationPlayState: isPaused ? 'paused' : 'running',
                            '@keyframes progress-loading': {
                              '0%': { width: '0%' },
                              '100%': { width: '100%' },
                            },
                          }}
                        />
                      )}
                    </Box>
                  );
                })}
          </Stack>
        </Paper>
      </Box>
      <Box sx={{ display: { xs: 'block', lg: 'none' }, mb: 6 }}>
        <Paper
          component={Link}
          href={`${urlPrefix}/${firstTopArticle?.id}`}
          sx={{
            position: 'relative',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '8px',
            marginBottom: '-40px',
            aspectRatio: '1280/424',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
          variant='outlined'
          className='banner-wrapper'
        >
          {articles?.length !== 0 ? (
            <DefaultImage
              src={
                articles[0]?.image &&
                `${process.env.NEXT_PUBLIC_BASE_URL}${articles[0].image.imageUrl}`
              }
              position='absolute'
              priority
              top={0}
              left={0}
              zIndex={0}
            />
          ) : (
            <DefaultImage
              src='/images/banner.png'
              position='absolute'
              priority
              top={0}
              left={0}
              zIndex={0}
            />
          )}
          <Stack
            direction='column'
            justifyContent='space-between'
            alignItems='flex-start'
            marginBottom={5}
          >
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                top: 0,
                left: 0,
                right: 0,
                background: `radial-gradient(transparent, rgba(0, 0, 0, 0.3))`,
                color: 'white',
                p: '40px 40px 0px',
              }}
            >
              <Typography
                variant='h1'
                sx={{
                  display: 'flex',
                  direction: 'row',
                  justifyContent: 'start',
                  alignItems: 'center',
                  fontSize: '20px',
                  gap: '4px',
                  color: vibrantTextColor,
                }}
              >
                <InsightsIcon sx={{ width: 40, height: 40, color: 'yellow' }} />
                {t('popular')}
              </Typography>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: `linear-gradient(to top, rgba(${vibrantR}, ${vibrantG}, ${vibrantB}, 0.8) 50%, transparent)`,
                color: vibrantTextColor,
                p: '0px 40px 56px',
              }}
            >
              {articles?.length !== 0 && (
                <Stack
                  direction='column'
                  justifyContent='space-between'
                  alignItems='flex-start'
                  spacing={1}
                  marginTop={5}
                >
                  <Typography
                    variant='subtitle1'
                    sx={{
                      flexGrow: 1,
                      lineHeight: 1.2,
                      maxHeight: '4.8em',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical',
                      color: vibrantTextColor,
                    }}
                    className='banner-title'
                  >
                    {firstTopArticle?.title}
                  </Typography>
                  <Stack
                    direction='row'
                    justifyContent='space-between'
                    alignItems='flex-start'
                    maxWidth={235}
                    spacing={1}
                    divider={
                      <Divider
                        orientation='vertical'
                        sx={{ borderColor: vibrantTextColor }}
                        flexItem
                      />
                    }
                  >
                    <span className='align-center flex flex-row gap-0.5 text-xs'>
                      <VisibilityOutlinedIcon
                        sx={{ width: '16px', height: '16px' }}
                      />
                      {firstTopArticle.viewsCount}
                    </span>
                    <span className='align-center flex flex-row gap-0.5 text-xs'>
                      <ChatOutlinedIcon
                        sx={{ width: '16px', height: '16px' }}
                      />
                      {firstTopArticle.commentsCount}
                    </span>
                    <span className='align-center flex flex-row gap-0.5 text-xs'>
                      <ThumbUpOutlinedIcon
                        sx={{ width: '16px', height: '16px' }}
                      />
                      {firstTopArticle.likesCount}
                    </span>
                  </Stack>
                </Stack>
              )}
            </Box>
          </Stack>
        </Paper>
        <Carousel
          articles={articles}
          lang={lang}
          isLoading={isLoading}
          isMinimalSlides
        />
      </Box>
    </section>
  );
};
