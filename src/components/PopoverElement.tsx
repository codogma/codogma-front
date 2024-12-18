'use client';
import { Link, Popover, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react';

interface PopoverElementProps {
  readonly destination: string;
}

export const PopoverElement: React.FC<PopoverElementProps> = ({
  destination,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const router = useRouter();
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleClickLink = (url: string) => {
    router.push(url);
    handlePopoverClose();
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
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
  );
};
