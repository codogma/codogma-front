'use client';
import { Button } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React, { useState } from 'react';

import { useT } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import { getUserByUsername } from '@/helpers/userApi';
import { GetUserDTO } from '@/types';

type PageParams = {
  username: string;
};

type PageProps = {
  readonly params: PageParams;
};

export default function Page({ params: { username } }: PageProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [currentCategory, setCurrentCategory] = useState<number | null>(null);
  const { t } = useT();
  const { state } = useAuth();

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
          <div className='user-profile-description'>О себе</div>
          <div className='user-profile-content'>{user?.bio}</div>
          <div className='user-categories-profile'>
            Пишет в категориях:
            <div className='user-tags'>
              {user?.categories.map((category) => (
                <span className='user-tag-item' key={category.id}>
                  <Link
                    className='tag-name'
                    href={`/categories/${category.id}`}
                  >
                    <Stack direction='row' spacing={1}>
                      <Chip
                        aria-owns={category.id.toString()}
                        aria-haspopup='true'
                        label={category.name}
                        variant='outlined'
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
                    </Stack>
                  </Link>
                </span>
              ))}
            </div>
          </div>
          {state.user?.username === username && (
            <Link href={`/profile-update`}>
              <Button type='submit'>{t('updateBtn')}</Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
