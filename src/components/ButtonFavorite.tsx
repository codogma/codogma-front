'use client';
import { Button, Link, Popover, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import {
  checkFavorite,
  favoriteToUser,
  unfavoriteToUser,
} from '@/helpers/categoryApi';

interface CustomFavoriterProps {
  readonly destination?: string;
  readonly username?: string;
  readonly id: number;
  readonly lang: string;
}

export const ButtonFavorite: React.FC<CustomFavoriterProps> = ({
  destination = 'add to favorite',
  id,
  lang,
  username,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const [isFavorite, setIsFavorite] = useState(false);
  const { state } = useAuth();
  const router = useRouter();
  const { t } = useTranslation(lang, 'categories');
  const open = Boolean(anchorEl);
  const popoverId = open ? 'simple-popover' : undefined;

  useEffect(() => {
    const check = async (id: number) => {
      await checkFavorite(id).then((response) => setIsFavorite(response));
    };
    if (state.isAuthenticated) {
      check(id);
    }
  }, [state.isAuthenticated, id]);

  const handleUnfavorite = async () => {
    if (state.isAuthenticated) {
      await unfavoriteToUser(id).then(() => setIsFavorite(false));
    }
  };

  const handleFavorite = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (state.isAuthenticated) {
      await favoriteToUser(id).then(() => setIsFavorite(true));
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClickLink = (url: string) => {
    router.push(url);
    handlePopoverClose();
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return state.user?.username !== username ? (
    <>
      {isFavorite ? (
        <Button className='article-red-btn' onClick={handleUnfavorite}>
          {t('removeFromFavorite')}
        </Button>
      ) : (
        <Button
          aria-describedby={popoverId}
          className='article-btn'
          onClick={handleFavorite}
        >
          {t('addToFavorite')}
        </Button>
      )}
      {!state.isAuthenticated && (
        <Popover
          id={popoverId}
          open={open}
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
        >
          <Typography
            variant='body2'
            sx={{ pl: '16px', pr: '16px', pt: '12px', pb: '12px' }}
          >
            <Link
              component='button'
              underline='none'
              onClick={() => handleClickLink('/sign-up')}
              sx={{ mr: '5px', verticalAlign: 'unset' }}
            >
              Sign up
            </Link>
            {destination}
          </Typography>
        </Popover>
      )}
    </>
  ) : null;
};
