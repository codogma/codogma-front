'use client';
import InfoIcon from '@mui/icons-material/Info';
import {
  Box,
  Button,
  CardHeader,
  CardMedia,
  Collapse,
  Skeleton,
} from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DOMPurify from 'isomorphic-dompurify';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import React, { useRef, useState } from 'react';

import { AvatarImage } from '@/components/AvatarImage';
import { useContentImageContext } from '@/components/ContentImageProvider';
import { DefaultImage } from '@/components/DefaultImage';
import MenuButton from '@/components/MenuButton';
import { Scrollbar } from '@/components/Scrollbar';
import { TimeAgo } from '@/components/TimeAgo';
import { GetArticle, Language, SwatchDTO, UserRole } from '@/types';

type ArticleCardProps = {
  readonly article: GetArticle;
  readonly lang: Language;
};

export const ArticleCard = ({ article, lang }: ArticleCardProps) => {
  const { data: state, status } = useSession();
  const pathname = usePathname();
  let urlPrefix = '';
  if (pathname.includes('compilations')) {
    urlPrefix = pathname;
  } else {
    urlPrefix = `/${lang}/articles`;
  }
  const { processContent } = useContentImageContext();
  const t = useTranslations('articlesPage');
  const previewContent = processContent(
    DOMPurify.sanitize(article?.previewContent),
  );
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
    <Card variant='outlined' className='card'>
      <CardHeader
        avatar={
          <AvatarImage
            alt={article.username}
            src={article.authorAvatarUrl}
            variant='rounded'
            size={34}
          />
        }
        action={
          status === 'authenticated' &&
          state?.user?.role !== UserRole.ROLE_ADMIN && (
            <MenuButton
              article={article}
              lang={lang}
              sx={{ color: darkMutedHex, '.dark &': { color: lightMutedHex } }}
            />
          )
        }
        title={
          <Link
            href={`/users/${article.username}`}
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
          background:
            `rgba(${vibrantR}, ${vibrantG}, ${vibrantB}, 0.5)` ??
            'rgba(0,0,0,0.8)',
          color: vibrantTextColor,
        }}
      />
      <Box className='card-media' onMouseLeave={() => setExpanded(false)}>
        <Collapse in={!expanded} timeout={{ enter: 300, exit: 300 }}>
          <CardMedia className='card-media'>
            <DefaultImage
              ref={imgRef}
              src={
                article.image &&
                `${process.env.NEXT_PUBLIC_BASE_URL}${article.image.imageUrl}`
              }
              className='card-media-image'
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: `linear-gradient(to top, ${`rgba(${vibrantR}, ${vibrantG}, ${vibrantB}, 0.8)` ?? 'rgba(0,0,0,0.8)'} 50%, transparent)`,
                color: 'white',
                p: '0.375rem', // или p-1.5 в tailwind
              }}
            >
              <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='center'
                spacing={1}
                marginTop={5}
              >
                <Link href={`${urlPrefix}/${article.id}`}>
                  <Typography
                    variant='subtitle1'
                    sx={{
                      flexGrow: 1,
                      lineHeight: 1.2,
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      maxHeight: '4.8em',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical',
                      color: vibrantTextColor,
                      '&:hover': {
                        color: lightMutedHex,
                      },
                    }}
                  >
                    {article.title}
                  </Typography>
                </Link>
                <IconButton
                  sx={{
                    color: vibrantTextColor,
                    flexShrink: 0,
                  }}
                  aria-label={`info about ${article.title}`}
                  onMouseEnter={() => setExpanded(true)}
                  onClick={() => setExpanded(true)}
                >
                  <InfoIcon />
                </IconButton>
              </Stack>
            </Box>
          </CardMedia>
        </Collapse>
        <Collapse in={expanded} timeout={{ enter: 300, exit: 300 }}>
          <CardContent
            component='div'
            className='card-content aspect-[16/8]'
            sx={{
              background: `rgba(${vibrantR}, ${vibrantG}, ${vibrantB}, 0.1)`,
            }}
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
              style={{ height: '100%' }}
              handleColor={mutedHex}
              handleDarkColor={lightMutedHex}
              handleHoverColor={vibrantHex}
              handleDarkHoverColor={lightVibrantHex}
              trackColor={`rgba(${mutedR}, ${mutedG}, ${mutedB}, 0.3)`}
              trackDarkColor={`rgba(${lightMutedR}, ${lightMutedG}, ${lightMutedB}, 0.3)`}
              trackHoverColor={`rgba(${vibrantR}, ${vibrantG}, ${vibrantB}, 0.5)`}
              trackDarkHoverColor={`rgba(${lightVibrantR}, ${lightVibrantG}, ${lightVibrantB}, 0.5)`}
            >
              <div className='article-preview-content'>{previewContent}</div>
            </Scrollbar>
          </CardContent>
        </Collapse>
      </Box>
      <CardActions
        sx={{
          background:
            `rgba(${vibrantR}, ${vibrantG}, ${vibrantB}, 0.5)` ??
            'rgba(0,0,0,0.8)',
          p: '0.375rem',
        }}
      >
        <Stack direction='row' spacing={2}>
          <Link href={`${urlPrefix}/${article.id}`}>
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
        </Stack>
      </CardActions>
    </Card>
  ) : (
    <Card variant='outlined' className='card'>
      <CardContent>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Skeleton animation='wave' variant='rounded' width={40} height={40} />
          <div style={{ flex: 1 }}>
            <Skeleton
              animation='wave'
              height={10}
              width='80%'
              style={{ marginBottom: 6 }}
            />
            <Skeleton animation='wave' height={10} width='40%' />
          </div>
        </div>
      </CardContent>
      <Skeleton sx={{ height: 190 }} animation='wave' variant='rectangular' />
      <CardContent>
        <Skeleton animation='wave' height={10} style={{ marginBottom: 6 }} />
        <Skeleton animation='wave' height={10} width='80%' />
      </CardContent>
    </Card>
  );
};
