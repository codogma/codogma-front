'use client';
import {
  Badge,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Skeleton,
  Stack,
} from '@mui/material';
import Link from 'next/link';
import React from 'react';

import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import { AvatarImage } from '@/components/AvatarImage';
import { Category, UserRole } from '@/types';

type CategoriesProps = {
  readonly categories: Category[];
  readonly loading: boolean;
  readonly lang: string;
};

export default function Categories({
  categories,
  loading,
  lang,
}: CategoriesProps) {
  const { state } = useAuth();
  const { t } = useTranslation(lang);

  return (
    <>
      {loading ? (
        <Card variant='outlined' className='card'>
          <CardContent className='card-content'>
            <div className='meta-container'>
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
      ) : (
        categories.map((category) => (
          <Card key={category.id} variant='outlined' className='card'>
            <CardContent className='card-content'>
              <div className='meta-container'>
                <Badge
                  className='items-start'
                  overlap='circular'
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <IconButton
                      component='label'
                      color='inherit'
                      sx={{ p: 0 }}
                    />
                  }
                >
                  <AvatarImage
                    alt={category.name}
                    className='category-img'
                    variant='rounded'
                    src={category.imageUrl}
                    size={48}
                  />
                </Badge>
                <ul>
                  <li>
                    <Link
                      href={`/categories/${category.id}`}
                      className='category-name'
                    >
                      {category.name}
                    </Link>
                  </li>
                  <li>
                    <p className='category-description'>
                      {category.description}
                    </p>
                  </li>
                  <li>
                    <div className='category-tags'>
                      {category.tags?.map((tag) => (
                        <span className='tag-item' key={tag.id}>
                          <Link
                            key={tag.id}
                            href={`/tags/${tag.id}`}
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
              <CardActions className='m-0 p-0'>
                <Stack direction='row' spacing={2}>
                  {state.user?.role === UserRole.ROLE_ADMIN && (
                    <Link href={`/categories/edit/${category.id}`}>
                      <Button className='article-btn' variant='outlined'>
                        {t('updateBtn')}
                      </Button>
                    </Link>
                  )}
                </Stack>
              </CardActions>
            </CardContent>
          </Card>
        ))
      )}
    </>
  );
}
