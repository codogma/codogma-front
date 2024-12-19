'use client';
import { Button } from '@mui/material';
import React, { useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import { PopoverElement } from '@/components/PopoverElement';
import { subscribe, unsubscribe } from '@/helpers/userApi';

interface CustomPopoverProps {
  readonly username: string;
  readonly lang: string;
  readonly isSubscribedValue?: boolean;
}

export const ButtonWithPopover: React.FC<CustomPopoverProps> = ({
  username,
  lang,
  isSubscribedValue,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const [isSubscribed, setIsSubscribed] = useState(isSubscribedValue);
  const { state } = useAuth();
  const { t } = useTranslation(lang, 'authors');
  const id = 'simple-popover';

  const handleUnsubscribe = async () => {
    if (state.isAuthenticated) {
      await unsubscribe(username).then((response) =>
        setIsSubscribed(response.isSubscribed),
      );
    }
  };

  const handleSubscribe = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (state.isAuthenticated) {
      await subscribe(username).then((response) =>
        setIsSubscribed(response.isSubscribed),
      );
    } else {
      setAnchorEl(event.currentTarget);
    }
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
        <PopoverElement
          popoverId={id}
          btnEl={anchorEl}
          onClose={handlePopoverClose}
          destination={t('popoverSubscribe')}
          lang={lang}
        />
      )}
    </>
  ) : null;
};
