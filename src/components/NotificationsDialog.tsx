import MailIcon from '@mui/icons-material/Mail';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';

type NotificationsButtonProps = {
  readonly title?: string;
};

export const NotificationsDialog = ({ title }: NotificationsButtonProps) => {
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {};
  return (
    <Tooltip title={title}>
      <IconButton color='inherit' onClick={handleOpen}>
        <Badge badgeContent={4} color='primary'>
          <MailIcon />
        </Badge>
      </IconButton>
    </Tooltip>
  );
};
