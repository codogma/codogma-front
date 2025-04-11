'use client';
import {
  Badge,
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import React from 'react';

import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import { AvatarImage } from '@/components/AvatarImage';
import { ButtonFavorite } from '@/components/ButtonFavorite';
import MenuButton from '@/components/MenuButton';
import { GetCategory, Language, UserRole } from '@/types';

type CategoryCardProps = {
  readonly category: GetCategory;
  readonly lang: Language;
  readonly refetch?: () => void;
};

export default function CategoryCard({
  category,
  lang,
  refetch,
}: CategoryCardProps) {
  const { state } = useAuth();
  const { t } = useTranslation(lang);

  return (
    <Card
      sx={{ display: 'flex', flexDirection: 'row' }}
      key={category.id}
      variant='outlined'
      className='card max-h-32'
    >
      <CardContent sx={{ flex: '1 0 auto' }}>
        <Typography component='div' variant='h5'>
          <Link href={`/categories/${category.id}`} className='category-name'>
            {category.name}
          </Link>
        </Typography>
        <Typography
          variant='subtitle1'
          component='div'
          sx={{ color: 'text.secondary' }}
        >
          <p className='category-description'>{category.description}</p>
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
          <IconButton aria-label='category'>
            <CardActions className='m-0 p-0'>
              <Stack direction='row' spacing={2}>
                {state.user?.role !== UserRole.ROLE_ADMIN ? (
                  <ButtonFavorite
                    lang={lang}
                    isFavoriteValue={category?.isFavorite}
                    id={category.id}
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
          </IconButton>
        </Box>
      </CardContent>
      {/*<ul>*/}
      {/*  <li>*/}
      {/*    <div className='category-tags'>*/}
      {/*      {category.tags?.map((tag) => (*/}
      {/*        <span className='tag-item' key={tag.id}>*/}
      {/*          <Link*/}
      {/*            key={tag.id}*/}
      {/*            href={`/tags/${tag.id}`}*/}
      {/*            className='tag-name'*/}
      {/*          >*/}
      {/*            {tag.name}*/}
      {/*          </Link>*/}
      {/*        </span>*/}
      {/*      ))}*/}
      {/*    </div>*/}
      {/*  </li>*/}
      {/*</ul>*/}
      <Badge
        className='items-start'
        overlap='circular'
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <IconButton component='label' color='inherit' sx={{ p: 0 }} />
        }
      >
        <CardMedia className='items-start'>
          <AvatarImage src={category.imageUrl} variant='rounded' size={112} />
        </CardMedia>
      </Badge>
    </Card>
  );
}
