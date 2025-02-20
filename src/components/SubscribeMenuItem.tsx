'use client';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PersonAddDisabledIcon from '@mui/icons-material/PersonAddDisabled';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import { PopoverElement } from '@/components/PopoverElement';
import { subscribe, unsubscribe } from '@/helpers/userApi';
import { GetUserDTO } from '@/types';

interface CustomPopoverProps {
  readonly user: GetUserDTO;
  readonly lang: string;
  readonly onClose?: () => void;
}

export const SubscribeMenuItem: React.FC<CustomPopoverProps> = ({
  user,
  lang,
  onClose,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const [isSubscribed, setIsSubscribed] = useState<boolean>(user?.isSubscribed);
  const { state } = useAuth();
  const { t } = useTranslation(lang, 'authors');
  const id = 'simple-popover';

  const handleChange = () => {
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
    }
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return state.user?.username !== user?.username ? (
    <>
      <MenuItem onClick={handleChange}>
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
          lang={lang}
        />
      )}
    </>
  ) : null;
};
