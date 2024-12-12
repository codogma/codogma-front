'use client';
import { Button, Link, Popover, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import { subscribeToUser, unsubscribeToUser } from '@/helpers/userApi';

interface CustomPopoverProps {
  readonly destination?: string;
  readonly username: string;
  readonly lang: string;
  readonly isSubscribedValue?: boolean;
}

export const ButtonWithPopover: React.FC<CustomPopoverProps> = ({
  destination = 'to subscribe to a user',
  username,
  lang,
  isSubscribedValue,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const [isSubscribed, setIsSubscribed] = useState(isSubscribedValue);
  const { state } = useAuth();
  const router = useRouter();
  const { t } = useTranslation(lang, 'authors');
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleUnsubscribe = async () => {
    if (state.isAuthenticated) {
      await unsubscribeToUser(username).then((response) =>
        setIsSubscribed(response.isSubscribed),
      );
    }
  };

  const handleSubscribe = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (state.isAuthenticated) {
      await subscribeToUser(username).then((response) =>
        setIsSubscribed(response.isSubscribed),
      );
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
      {isSubscribed ? (
        <Button className='article-red-btn' onClick={handleUnsubscribe}>
          {t('unsubscribeBtn')}
        </Button>
      ) : (
        <Button
          aria-describedby={id}
          className='article-btn'
          onClick={handleSubscribe}
        >
          {t('subscribeBtn')}
        </Button>
      )}
      {!state.isAuthenticated && (
        <Popover
          id={id}
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
