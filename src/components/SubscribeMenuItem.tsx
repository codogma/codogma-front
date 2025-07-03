'use client';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PersonAddDisabledIcon from '@mui/icons-material/PersonAddDisabled';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { useAuth } from '@/components/AuthProvider';
import { PopoverElement } from '@/components/PopoverElement';
import { subscribe, unsubscribe } from '@/helpers/userApi';
import { GetUserDTO } from '@/types';

interface CustomPopoverProps {
  readonly user: GetUserDTO;
  readonly onClose?: () => void;
}

export const SubscribeMenuItem: React.FC<CustomPopoverProps> = ({
  user,
  onClose,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(user?.isSubscribed);
  const { state } = useAuth();
  const t = useTranslations('authorsPage');
  const id = 'simple-popover';

  const handleChange = (event: React.MouseEvent<HTMLElement>) => {
    if (onClose) {
      onClose();
    }
    if (state.isAuthenticated) {
      if (!isSubscribed) {
        subscribe(user.username).then((response) =>
          setIsSubscribed(response.isSubscribed),
        );
      } else {
        unsubscribe(user.username).then((response) =>
          setIsSubscribed(response.isSubscribed),
        );
      }
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return state.user?.username !== user?.username ? (
    <>
      <MenuItem onClick={handleChange} disableRipple>
        <Typography textAlign='center'>
          {isSubscribed ? (
            <>
              <PersonAddDisabledIcon />
              {t('unsubscribe')}
            </>
          ) : (
            <>
              <PersonAddAltIcon aria-describedby={id} />
              {t('subscribe')}
            </>
          )}
        </Typography>
      </MenuItem>
      {!state.isAuthenticated && (
        <PopoverElement
          popoverId={id}
          btnEl={anchorEl}
          onClose={handlePopoverClose}
          destination={t('popoverSubscribe')}
        />
      )}
    </>
  ) : null;
};
