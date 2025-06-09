'use client';
import { CardHeader, Skeleton } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import React from 'react';

import { useT } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import { AvatarImage } from '@/components/AvatarImage';
import MenuButton from '@/components/MenuButton';
import { GetUserDTO, Language, UserRole } from '@/types';

type AuthorsProps = {
  readonly users: GetUserDTO[];
  readonly loading?: boolean;
  readonly lang: Language;
};

export default function Users({ users, loading, lang }: AuthorsProps) {
  const { state } = useAuth();
  const { t } = useT('authors');

  return (
    <>
      {loading ? (
        <Card variant='outlined' className='itb-user'>
          <CardContent className='card-content'>
            <Skeleton variant='rounded' width={24} height={24} />
            <div>
              <Skeleton variant='text' width={100} />
            </div>
            <div>
              <Skeleton variant='text' width={100} />
            </div>
            <div>
              <Skeleton variant='text' width={150} />
            </div>
          </CardContent>
        </Card>
      ) : (
        users?.map((user) => (
          <Card key={user.username} variant='outlined' className='itb-user'>
            <CardHeader
              avatar={
                <AvatarImage
                  alt={user.username}
                  className='user-avatar'
                  src={user.avatarUrl}
                  variant='rounded'
                  size={24}
                />
              }
              action={<MenuButton user={user} lang={lang} />}
              title={
                <Link href={`/users/${user.username}`} className='user-title'>
                  {user.username}
                </Link>
              }
              subheader={
                <Typography className='user-description'>
                  {user.shortInfo}
                </Typography>
              }
            />
            {state.user?.role === UserRole.ROLE_AUTHOR &&
              user.categories?.length > 0 && (
                <CardContent>
                  <div className='user-item_categories'>
                    {t('writesInCategories')}
                    <div className='user-tags'>
                      {user.categories?.map((category) => (
                        <span className='user-tag-item' key={category.id}>
                          <Link
                            className='tag-name'
                            href={`/categories/${category.id}`}
                          >
                            {category.name}
                          </Link>
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}
          </Card>
        ))
      )}
    </>
  );
}
