'use client';
import InfoIcon from '@mui/icons-material/Info';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Collapse,
  IconButton,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import React, { useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import { ButtonFavorite } from '@/components/ButtonFavorite';
import { DefaultImage } from '@/components/DefaultImage';
import MenuButton from '@/components/MenuButton';
import { GetCategory, Language, UserRole } from '@/types';

type CategoryCardProps = {
  readonly lang: Language;
  readonly category: GetCategory;
  readonly refetch?: () => void;
};

export default function CategoryCard({
  category,
  lang,
  refetch,
}: CategoryCardProps) {
  const { state } = useAuth();
  const { t } = useTranslation(lang);
  const [expanded, setExpanded] = useState(false);

  return (
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
                      lang={lang}
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
                    />
                  )}
                </Stack>
              </CardActions>
            </Box>
            <DefaultImage
              src={
                category.imageUrl &&
                `${process.env.NEXT_PUBLIC_BASE_URL}${category.imageUrl}`
              }
              top={0}
              left={0}
              zIndex={0}
              className='scale-x-100 transition-transform will-change-transform'
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(0,0,0,0.6)',
                color: 'white',
                p: 1,
              }}
            >
              <Stack
                direction='row'
                justifyContent='center'
                alignItems='center'
                spacing={1}
              >
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
                  }}
                >
                  <Link href={`/categories/${category.id}`}>
                    {category.name}
                  </Link>
                </Typography>
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
              <div className='article-preview-content'>
                <p>
                  <b>Описание:</b>
                </p>
                <p>{category.description}</p>
                <ul>
                  <b>Популярные теги:</b>
                  <li>
                    <div className='category-tags'>
                      {category.tags?.map((tag) => (
                        <span className='tag-item' key={tag.id}>
                          <Link
                            key={tag.id}
                            href={`/${lang}/articles?type=tag&value=${tag.name}`}
                            className='tag-name'
                          >
                            {tag.name}
                          </Link>
                        </span>
                      ))}
                    </div>
                  </li>
                </ul>
              </div>
            </Box>
          </CardContent>
        </Collapse>
      </Box>
      <CardActions>
        <Stack direction='row' spacing={2}>
          <Link href={`/categories/${category.id}`}>
            <Button className='article-btn' variant='outlined'>
              {t('readMoreBtn')}
            </Button>
          </Link>
        </Stack>
      </CardActions>
    </Card>
  );
}
