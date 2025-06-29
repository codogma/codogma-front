'use client';
import InfoIcon from '@mui/icons-material/Info';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Collapse,
  IconButton,
  Skeleton,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import React, { useRef, useState } from 'react';

import { useT } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import { ButtonFavorite } from '@/components/ButtonFavorite';
import { DefaultImage } from '@/components/DefaultImage';
import MenuButton from '@/components/MenuButton';
import { GetCategory, Language, SwatchDTO, UserRole } from '@/types';

type CategoryCardProps = {
  readonly lang: Language;
  readonly category: GetCategory;
  readonly refetch?: () => void;
};

export const CategoryCard = ({
  category,
  lang,
  refetch,
}: CategoryCardProps) => {
  const { state } = useAuth();
  const { t } = useT('categories');
  const [expanded, setExpanded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const palette = category?.image?.palette;

  const vibrant = (palette?.vibrant || {}) as SwatchDTO;
  const {
    r: vibrantR = 0,
    g: vibrantG = 0,
    b: vibrantB = 0,
    titleTextColor: vibrantTextColor = '#fff',
  } = vibrant;

  const lightMuted = (palette?.lightMuted || {}) as SwatchDTO;
  const { hex: lightMutedHex = '#fff' } = lightMuted;

  const darkMuted = (palette?.darkMuted || {}) as SwatchDTO;
  const { hex: darkMutedHex = '#fff' } = darkMuted;

  return category ? (
    <Card variant='outlined' className='card'>
      <Box className='card-media' onMouseLeave={() => setExpanded(false)}>
        <Collapse in={!expanded} timeout={{ enter: 300, exit: 300 }}>
          <CardMedia className='card-media'>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                color: 'white',
                zIndex: 1,
              }}
            >
              <CardActions>
                <Stack direction='row' spacing={1}>
                  {state.user?.role !== UserRole.ROLE_ADMIN ? (
                    <ButtonFavorite
                      isFavoriteValue={category?.isFavorite}
                      id={category.id}
                      sx={{
                        background: 'rgba(0,0,0,0.6)',
                        transition: 'background 0.3s ease',
                        '&:hover': {
                          background: 'rgba(0, 0, 0, 0.3)',
                        },
                        '&.Mui-focusVisible': {
                          background: 'rgba(0, 0, 0, 0.3)',
                        },
                      }}
                      style={{ color: 'white' }}
                    />
                  ) : (
                    <MenuButton
                      category={category}
                      lang={lang}
                      refetch={refetch}
                      sx={{
                        color: darkMutedHex,
                        '.dark &': { color: lightMutedHex },
                      }}
                    />
                  )}
                </Stack>
              </CardActions>
            </Box>
            <DefaultImage
              ref={imgRef}
              src={
                category.image &&
                `${process.env.NEXT_PUBLIC_BASE_URL}${category.image.imageUrl}`
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
                p: 1,
              }}
            >
              <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='center'
                spacing={1}
                marginTop={5}
              >
                <Link href={`/categories/${category.id}`}>
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
                    {category.name}
                  </Typography>
                </Link>
                <IconButton
                  sx={{
                    color: 'white',
                    flexShrink: 0,
                  }}
                  aria-label={`info about ${category.name}`}
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
          <CardContent component='div' className='card-content aspect-[16/8]'>
            <Box
              sx={{
                height: '100%',
                overflowY: 'auto',
                scrollbarWidth: 'thin',
                pr: 1,
              }}
            >
              <div className='category-preview-content'>
                <section>
                  <b>{t('description')}:</b>
                  <p>{category.description}</p>
                </section>
                <section>
                  <b>{t('popularTags')}:</b>
                  <ul>
                    {category.tags?.map((tag) => (
                      <li key={tag.id} className='tag-item'>
                        <Link
                          href={{
                            pathname: `/${lang}/articles`,
                            query: { type: 'tag', value: tag.name },
                          }}
                        >
                          <span className='tag-name'>{tag.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </Box>
          </CardContent>
        </Collapse>
      </Box>
    </Card>
  ) : (
    <Card variant='outlined' className='card'>
      <CardContent className='card-content'>
        <div className='card-header'>
          <Skeleton variant='rounded' width={48} height={48} />
          <ul>
            <li>
              <Skeleton variant='text' width={100} />
            </li>
            <li>
              <Skeleton variant='text' width={150} />
            </li>
            <li>
              <Skeleton variant='text' width={150} />
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
