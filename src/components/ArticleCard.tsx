'use client';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import InfoOutlineIcon from '@mui/icons-material/InfoOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
  Box,
  Button,
  CardHeader,
  CardMedia,
  Collapse,
  Divider,
  Skeleton,
  Typography,
} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import DOMPurify from 'isomorphic-dompurify';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import React, { useRef, useState } from 'react';

import { AvatarImage } from '@/components/AvatarImage';
import { useContentImageContext } from '@/components/ContentImageProvider';
import { DefaultImage } from '@/components/DefaultImage';
import { MenuButton } from '@/components/MenuButton';
import { Scrollbar } from '@/components/Scrollbar';
import { TimeAgo } from '@/components/TimeAgo';
import { GetArticle, Language, SwatchDTO, UserRole } from '@/types';

type ArticleCardProps = {
  readonly article: GetArticle | null;
  readonly lang: Language;
  readonly isMinimal?: boolean;
};

export const ArticleCard = ({ article, lang, isMinimal }: ArticleCardProps) => {
  const { data: state, status } = useSession();
  const pathname = usePathname();
  let urlPrefix: string;
  if (pathname.includes('compilations')) {
    urlPrefix = pathname;
  } else {
    urlPrefix = `/${lang}/articles`;
  }
  const { processContent } = useContentImageContext();
  const t = useTranslations('articlesPage');
  const previewRaw = article?.previewContent ?? '';
  const previewContent = processContent(DOMPurify.sanitize(previewRaw));
  const [expanded, setExpanded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const palette = article?.image?.palette;

  const vibrant = (palette?.vibrant || {}) as SwatchDTO;
  const {
    r: vibrantR = 0,
    g: vibrantG = 0,
    b: vibrantB = 0,
    hex: vibrantHex = '#fff',
    titleTextColor: vibrantTextColor = '#fff',
  } = vibrant;

  const lightVibrant = (palette?.lightVibrant || {}) as SwatchDTO;
  const {
    r: lightVibrantR = 0,
    g: lightVibrantG = 0,
    b: lightVibrantB = 0,
    hex: lightVibrantHex = '#fff',
  } = lightVibrant;

  const darkVibrant = (palette?.darkVibrant || {}) as SwatchDTO;
  const { hex: darkVibrantHex = '#fff' } = darkVibrant;

  const muted = (palette?.muted || {}) as SwatchDTO;
  const {
    r: mutedR = 0,
    g: mutedG = 0,
    b: mutedB = 0,
    hex: mutedHex = '#fff',
  } = muted;

  const lightMuted = (palette?.lightMuted || {}) as SwatchDTO;
  const {
    r: lightMutedR = 0,
    g: lightMutedG = 0,
    b: lightMutedB = 0,
    hex: lightMutedHex = '#fff',
  } = lightMuted;

  const darkMuted = (palette?.darkMuted || {}) as SwatchDTO;
  const { hex: darkMutedHex = '#fff' } = darkMuted;

  return article ? (
    <Card
      variant='outlined'
      className='card'
      sx={{
        borderWidth: isMinimal ? 0 : '1px',
      }}
    >
      {!isMinimal && (
        <CardHeader
          avatar={
            <AvatarImage
              alt={article.username}
              src={article.authorAvatarUrl}
              variant='rounded'
              size={34}
              priority
            />
          }
          action={
            <Stack direction='row' spacing={1}>
              {status === 'authenticated' &&
                state?.user?.role !== UserRole.ROLE_ADMIN && (
                  <MenuButton
                    article={article}
                    lang={lang}
                    sx={{
                      color: darkVibrantHex,
                      '.dark &': { color: lightVibrantHex },
                    }}
                  />
                )}
              <Checkbox
                checked={expanded}
                onChange={() => setExpanded(!expanded)}
                icon={
                  <InfoOutlineIcon
                    sx={{
                      fontSize: '20px',
                    }}
                    viewBox='2 2 20 20'
                  />
                }
                checkedIcon={<CancelOutlinedIcon />}
                className='info-checkbox'
                slotProps={{
                  input: { 'aria-label': `info about ${article.title}` },
                }}
                sx={{
                  color: darkVibrantHex,
                  '&.Mui-checked': {
                    color: darkVibrantHex,
                  },
                  '&.Mui-checked svg': {
                    animation: 'none',
                  },
                  ':hover svg': {
                    animation: 'none',
                  },
                  '.dark &': {
                    color: lightVibrantHex,
                    '&.Mui-checked': {
                      animation: 'none',
                      color: lightVibrantHex,
                    },
                  },
                  width: '34px',
                  height: '34px',
                }}
              />
            </Stack>
          }
          title={
            <Link
              href={`/${lang}/users/${article.username}`}
              className='article-user-name'
            >
              {article.username}
            </Link>
          }
          subheader={
            <TimeAgo
              datetime={article.createdAt}
              className='article-datetime'
              lang={lang}
            />
          }
          className='card-header'
          slotProps={{
            title: {
              component: 'span',
              sx: {
                a: {
                  fontSize: 'inherit',
                  color: vibrantTextColor,
                  '&:hover': {
                    color: darkVibrantHex,
                  },
                  '.dark &': {
                    color: vibrantTextColor,
                    '&:hover': {
                      color: lightVibrantHex,
                    },
                  },
                },
              },
            },
            subheader: {
              sx: {
                time: {
                  color: darkVibrantHex,
                  '.dark &': { color: lightVibrantHex },
                },
              },
            },
          }}
          sx={{
            background: `rgba(${vibrantR}, ${vibrantG}, ${vibrantB}, 0.5)`,
            color: vibrantTextColor,
          }}
        />
      )}
      <Box
        className='card-media'
        sx={{
          background: `rgba(${vibrantR}, ${vibrantG}, ${vibrantB}, 0.1)`,
        }}
      >
        <Collapse in={!expanded} timeout={{ enter: 300, exit: 300 }}>
          <CardMedia
            component={Link}
            href={`${urlPrefix}/${article.id}`}
            className='card-media'
          >
            <DefaultImage
              ref={imgRef}
              src={
                article?.image &&
                `${process.env.NEXT_PUBLIC_BASE_URL}${article?.image.imageUrl}`
              }
              className='card-media-image'
              priority
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: `linear-gradient(to top, rgba(${vibrantR}, ${vibrantG}, ${vibrantB}, 0.8) 50%, transparent)`,
                color: vibrantTextColor,
                p: '0 12px 12px', // или p-1 в tailwind
              }}
            >
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
                    maxHeight: '4.8em',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    color: vibrantTextColor,
                  }}
                  className='card-title'
                >
                  {article.title}
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
                    {article.viewsCount}
                  </span>
                  <span className='align-center flex flex-row gap-0.5 text-xs'>
                    <ChatOutlinedIcon sx={{ width: '16px', height: '16px' }} />
                    {article.commentsCount}
                  </span>
                  <span className='align-center flex flex-row gap-0.5 text-xs'>
                    <ThumbUpOutlinedIcon
                      sx={{ width: '16px', height: '16px' }}
                    />
                    {article.likesCount}
                  </span>
                </Stack>
              </Stack>
            </Box>
          </CardMedia>
        </Collapse>
        <Collapse
          in={expanded}
          timeout={{ enter: 300, exit: 300 }}
          className='left-0 top-0 z-0'
        >
          <CardContent
            component='div'
            className='card-content aspect-video h-full'
          >
            {(state?.user?.name === article.username ||
              state?.user?.role === UserRole.ROLE_ADMIN) && (
              <Stack direction='row' spacing={1}>
                <Chip
                  size='small'
                  color='primary'
                  label={t(article.status.toLowerCase())}
                  variant='outlined'
                />
                <Chip
                  size='small'
                  color='success'
                  label={t(article.language.toLowerCase() + '_short')}
                  variant='outlined'
                />
              </Stack>
            )}
            <Scrollbar
              handleColor={mutedHex}
              handleDarkColor={lightMutedHex}
              handleHoverColor={vibrantHex}
              handleDarkHoverColor={lightVibrantHex}
              trackColor={`rgba(${mutedR}, ${mutedG}, ${mutedB}, 0.3)`}
              trackDarkColor={`rgba(${lightMutedR}, ${lightMutedG}, ${lightMutedB}, 0.3)`}
              trackHoverColor={`rgba(${vibrantR}, ${vibrantG}, ${vibrantB}, 0.5)`}
              trackDarkHoverColor={`rgba(${lightVibrantR}, ${lightVibrantG}, ${lightVibrantB}, 0.5)`}
            >
              <div className='preview-content'>{previewContent}</div>
            </Scrollbar>
            <Link href={`${urlPrefix}/${article.id}`} scroll={false}>
              <Button
                className='article-btn'
                variant='outlined'
                sx={{
                  borderColor: darkVibrantHex,
                  color: darkVibrantHex,
                  '&:hover': {
                    backgroundColor: darkVibrantHex,
                    color: lightMutedHex,
                  },
                  '.dark &': {
                    borderColor: lightVibrantHex,
                    color: lightVibrantHex,
                    '&:hover': {
                      backgroundColor: lightVibrantHex,
                      color: darkMutedHex,
                    },
                  },
                }}
              >
                {t('readMoreBtn')}
              </Button>
            </Link>
          </CardContent>
        </Collapse>
      </Box>
    </Card>
  ) : (
    <Card variant='outlined' className='card'>
      {!isMinimal && (
        <CardHeader
          avatar={
            <Skeleton
              animation='pulse'
              variant='rounded'
              className='skeleton-avatar'
            />
          }
          title={<Skeleton animation='pulse' className='skeleton-title' />}
          subheader={
            <Skeleton animation='pulse' className='skeleton-subheader' />
          }
          className='card-header skeleton-card-header'
        />
      )}
      <Box className='card-media skeleton-card-media'>
        <Skeleton
          animation='pulse'
          variant='rectangular'
          className='skeleton-rectangular'
        >
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: 1.5,
            }}
          >
            <Stack direction='column' spacing={1} marginTop={5}>
              <Skeleton
                animation='pulse'
                width='90%'
                className='skeleton-title-line'
              />
              <Skeleton
                animation='pulse'
                width='75%'
                className='skeleton-title-line'
              />
              <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='center'
                spacing={1}
              >
                <Skeleton animation='pulse' className='skeleton-stat-item' />
                <Skeleton animation='pulse' className='skeleton-stat-item' />
                <Skeleton animation='pulse' className='skeleton-stat-item' />
              </Stack>
            </Stack>
          </Box>
        </Skeleton>
      </Box>
    </Card>
  );
};
