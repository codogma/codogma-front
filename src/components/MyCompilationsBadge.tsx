import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ViewListIcon from '@mui/icons-material/ViewList';
import { Badge } from '@mui/material';
import React from 'react';

export const MyCompilationsBadge = () => {
  return (
    <Badge
      badgeContent={
        <AccountCircleIcon
          sx={{
            marginLeft: -1,
            marginBottom: 2,
            borderRadius: 5,
            fontSize: 15,
          }}
          className='bg-white dark:bg-bunker'
        />
      }
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      sx={{
        mr: 1,
      }}
    >
      <ViewListIcon />
    </Badge>
  );
};
