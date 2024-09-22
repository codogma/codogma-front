'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { Button, Link, Popover, Typography } from '@mui/material';
import {
  checkSubscription,
  subscribeToUser,
  unsubscribeToUser,
} from '@/helpers/userApi';

interface CustomPopoverProps {
  destination?: string;
  username: string;
}

export const ButtonWithPopover: React.FC<CustomPopoverProps> = ({
  destination = 'to subscribe to a user',
  username,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { state } = useAuth();
  const router = useRouter();
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  useEffect(() => {
    const check = async (username: string) => {
      await checkSubscription(username)
        .then((response) => setIsSubscribed(response))
        .catch((error) => console.error('Error checking subscription:', error));
    };
    if (state.isAuthenticated) {
      check(username);
    }
  }, [state.isAuthenticated, username]);

  const handleUnsubscribe = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (state.isAuthenticated) {
      await unsubscribeToUser(username)
        .then(() => setIsSubscribed(false))
        .catch((error) => console.error('Error unsubscribing:', error));
    }
  };

  const handleSubscribe = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (state.isAuthenticated) {
      await subscribeToUser(username)
        .then(() => setIsSubscribed(true))
        .catch((error) => console.error('Error subscribing:', error));
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
        <Button className='article-btn' onClick={handleUnsubscribe}>
          Following
        </Button>
      ) : (
        <Button
          aria-describedby={id}
          className='article-btn'
          onClick={handleSubscribe}
        >
          Follow
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
