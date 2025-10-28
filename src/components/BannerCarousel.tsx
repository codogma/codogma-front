'use client';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import InsightsIcon from '@mui/icons-material/Insights';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Box, Divider, Paper, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React from 'react';

import { Carousel } from '@/components/Carousel';
import { DefaultImage } from '@/components/DefaultImage';
import { devConsoleInfo } from '@/helpers/devConsoleLogs';
import { GetArticle, Language, SwatchDTO } from '@/types';

type BannerCarouselProps = {
  readonly articles: GetArticle[] | [];
  readonly lang: Language;
  readonly isLoading: boolean;
};

export const BannerCarousel = ({
  articles,
  lang,
  isLoading,
}: BannerCarouselProps) => {
  const pathname = usePathname();
  let urlPrefix = '';
  if (pathname.includes('compilations')) {
    urlPrefix = pathname;
  } else {
    urlPrefix = `/${lang}/articles`;
  }

  const t = useTranslations('mainPage');
  devConsoleInfo(articles);

  const firstTopArticle = articles[0];

  const palette = firstTopArticle?.image?.palette;

  const vibrant = (palette?.vibrant || {}) as SwatchDTO;
  const {
    r: vibrantR = 0,
    g: vibrantG = 0,
    b: vibrantB = 0,
    titleTextColor: vibrantTextColor = '#fff',
  } = vibrant;

  return (
    <section className='banner'>
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
              color: 'white',
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
                  divider={<Divider orientation='vertical' flexItem />}
                >
                  <span className='align-center flex flex-row gap-0.5 text-xs'>
                    <VisibilityOutlinedIcon
                      sx={{ width: '16px', height: '16px' }}
                    />
                    {firstTopArticle.viewsCount}
                  </span>
                  <span className='align-center flex flex-row gap-0.5 text-xs'>
                    <ChatOutlinedIcon sx={{ width: '16px', height: '16px' }} />
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
    </section>
  );
};
