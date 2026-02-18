'use client';
import { Button } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Popover from '@mui/material/Popover';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import React, { use, useState } from 'react';

import { AvatarImage } from '@/components/AvatarImage';
import { getUserByUsername } from '@/helpers/userApi';
import { GetUserDTO } from '@/types';

type PageProps = {
  readonly params: Promise<{
    username: string;
    lng: string;
  }>;
};

export default function Page({ params }: PageProps) {
  const { lng, username } = use(params);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [currentCategory, setCurrentCategory] = useState<number | null>(null);
  const t = useTranslations('authorsPage');
  const { data: state } = useSession();

  const { data } = useQuery<GetUserDTO>({
    queryKey: ['user', username],
    queryFn: () => getUserByUsername(username),
  });

  const user: GetUserDTO = data as GetUserDTO;

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement>,
    categoryId: number,
  ) => {
    setAnchorEl(event.currentTarget);
    setCurrentCategory(categoryId);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setCurrentCategory(null);
  };

  const open = Boolean(anchorEl) && Boolean(currentCategory);

  return (
    <Card variant='outlined' className='card'>
      <CardContent className='card-content'>
        <div>
          <div className='user-profile-item'>{t('aboutMyself')}:</div>
          <div className='user-profile-content'>{user?.bio}</div>
          <div className='user-profile-item'>{t('writesInCategories')}:</div>
          <div className='flex flex-wrap gap-1'>
            {user?.categories.map((category) => (
              <Link
                key={category.id}
                href={`/${lng}/categories/${category.id}`}
              >
                <Chip
                  aria-owns={category.id.toString()}
                  aria-haspopup='true'
                  label={category.name}
                  variant='outlined'
                  avatar={
                    <AvatarImage
                      alt={category?.name}
                      src={category?.icon?.imageUrl}
                      variant='circular'
                      size={24}
                    />
                  }
                  onMouseEnter={(event) =>
                    handlePopoverOpen(event, category.id)
                  }
                  onMouseLeave={handlePopoverClose}
                />
                <Popover
                  id={category.id.toString()}
                  sx={{ pointerEvents: 'none' }}
                  open={open && currentCategory === category.id}
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  onClose={handlePopoverClose}
                  disableRestoreFocus
                >
                  <Card>
                    <CardContent>
                      <div className='card-header'>
                        <div className='category-card-name'>
                          {category.name}
                        </div>
                        <div className='category-card-description'>
                          {category.description}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Popover>
              </Link>
            ))}
          </div>
          {state?.user?.name === username && (
            <Link href={`/profile-update`}>
              <Button type='submit'>{t('updateProfileBtn')}</Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
