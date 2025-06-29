import { EmailOutlined } from '@mui/icons-material';
import {
  CardHeader,
  CardMedia,
  Chip,
  Skeleton,
  Typography,
} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Link from 'next/link';
import React from 'react';

import { useT } from '@/app/i18n/client';
import { AvatarImage } from '@/components/AvatarImage';
import MenuButton from '@/components/MenuButton';
import { GetUserDTO, Language, UserRole } from '@/types';

type UserCardProps = {
  readonly user: GetUserDTO;
  readonly lang: Language;
};

export const UserCard = ({ user, lang }: UserCardProps) => {
  const { t } = useT('authors');

  return user ? (
    <Card variant='outlined' className='card'>
      <CardMedia component='div'>
        <CardHeader
          avatar={
            <AvatarImage
              alt={user.username}
              src={user.avatarUrl}
              variant='circular'
              size={80}
            />
          }
          action={<MenuButton user={user} lang={lang} />}
          title={
            <Link href={`/users/${user.username}`} className='user-title'>
              {user?.firstName} {user?.lastName}
            </Link>
          }
          disableTypography
          subheader={
            <>
              <Typography className='user-nickname'>{`@${user.username}`}</Typography>
              <Typography className='user-email'>
                <EmailOutlined fontSize='small' />
                <Link href={`mailto:${user.email}`}>{user.email}</Link>
              </Typography>
            </>
          }
          sx={{
            alignItems: 'center',
          }}
        />
      </CardMedia>
      {user?.role === UserRole.ROLE_AUTHOR && user.categories?.length > 0 && (
        <CardContent className='user-card-content'>
          <div className='user-profile-item'>{t('writesInCategories')}:</div>
          <div className='flex flex-wrap gap-1'>
            {user.categories?.map((category) => (
              <Link
                key={category.id}
                href={`/${lang}/categories/${category.id}`}
              >
                <Chip
                  variant='outlined'
                  label={category.name}
                  avatar={
                    <AvatarImage
                      alt={category?.name}
                      src={category?.icon?.imageUrl}
                      variant='circular'
                      size={24}
                    />
                  }
                />
              </Link>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  ) : (
    <Card variant='outlined' className='card'>
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
  );
};
