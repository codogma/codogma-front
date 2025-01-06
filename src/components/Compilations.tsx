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
import { GetCompilation, UserRole } from '@/types';

type CompilationsProps = {
  readonly compilations: GetCompilation[];
  readonly loading: boolean;
  readonly lang: string;
};

export default function Compilations({
  compilations,
  loading,
  lang,
}: CompilationsProps) {
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
        compilations?.map((compilation) => (
          <Card key={compilation.id} variant='outlined' className='card'>
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
                    alt={compilation.title}
                    className='category-img'
                    variant='rounded'
                    src={compilation.imageUrl}
                    size={48}
                  />
                </Badge>
                <ul>
                  <li>
                    <Link
                      href={`/compilations/${compilation.id}`}
                      className='category-name'
                    >
                      {compilation.title}
                    </Link>
                  </li>
                  <li>
                    <p className='category-description'>
                      {compilation.description}
                    </p>
                  </li>
                </ul>
                <CardActions className='m-0 p-0'>
                  <Stack direction='row' spacing={2}>
                    {state.user?.role === UserRole.ROLE_ADMIN && (
                      <Link href={`/categories/edit/${compilation.id}`}>
                        <Button className='article-btn' variant='outlined'>
                          {t('editBtn')}
                        </Button>
                      </Link>
                    )}
                  </Stack>
                </CardActions>
                <Button className='article-btn' variant='outlined'>
                  Удалить
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </>
  );
}
