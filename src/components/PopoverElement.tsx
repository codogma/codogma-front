'use client';
import { Link, Popover, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react';

import { useTranslation } from '@/app/i18n/client';

interface PopoverElementProps {
  readonly destination: string;
  readonly popoverId: string;
  readonly lang: string;
  readonly btnEl: HTMLElement | null;
  readonly onClose?: () => void;
}

export const PopoverElement: React.FC<PopoverElementProps> = ({
  destination,
  popoverId,
  lang,
  btnEl,
  onClose,
}) => {
  const router = useRouter();
  const open = Boolean(btnEl);

  const { t } = useTranslation(lang, 'articles');
  const id = open ? popoverId : undefined;

  const handleClickLink = (url: string) => {
    router.push(url);
  };

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={btnEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      onClose={onClose}
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
          {t('popoverSignup')}
        </Link>
        {destination}
      </Typography>
    </Popover>
  );
};
