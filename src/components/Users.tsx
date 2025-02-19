'use client';
import { Badge, IconButton, Skeleton } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Link from 'next/link';
import React from 'react';

import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import { AvatarImage } from '@/components/AvatarImage';
import { SubscribeMenuItem } from '@/components/SubscribeMenuItem';
import { GetUserDTO, UserRole } from '@/types';

type AuthorsProps = {
  readonly users: GetUserDTO[];
  readonly loading?: boolean;
  readonly lang: string;
};

export default function Users({ users, loading, lang }: AuthorsProps) {
  const { state } = useAuth();
  const { t } = useTranslation(lang, 'authors');

  return (
    <>
      {loading ? (
        <Card variant='outlined' className='itb-user'>
          <CardContent className='card-content'>
            <div className='user-meta-container'>
              <Skeleton variant='rounded' width={24} height={24} />
            </div>
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
            <CardContent className='card-content'>
              <div className='user-meta-container'>
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
                    alt={user.username}
                    className='user-avatar'
                    src={user.avatarUrl}
                    variant='rounded'
                    size={24}
                  />
                </Badge>
                <ul>
                  <li>
                    <Link
                      href={`/users/${user.username}`}
                      className='user-title'
                    >
                      {user.username}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/users/${user.username}`}
                      className='user-nickname'
                    >
                      @{user.username}
                    </Link>
                  </li>
                  <li>
                    <div className='user-description'>{user.shortInfo}</div>
                  </li>
                  <li>
                    {state.user?.role === UserRole.ROLE_AUTHOR &&
                      user.categories?.length > 0 && (
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
                      )}
                  </li>
                </ul>
              </div>
              <SubscribeMenuItem user={user} lang={lang} />
            </CardContent>
          </Card>
        ))
      )}
    </>
  );
}
