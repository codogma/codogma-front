'use client';
import FullscreenExitOutlinedIcon from '@mui/icons-material/FullscreenExitOutlined';
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import IconButton from '@mui/material/IconButton';
import React from 'react';

import { useNavigation } from '@/components/NavigationProvider';
import { NavTooltip } from '@/components/NavTooltip';

export const FullscreenButton = () => {
  const { isFullscreen, setIsFullscreen } = useNavigation();

  // TODO переписать через Checkbox
  return (
    <NavTooltip
      title={isFullscreen ? 'Показать навигацию' : 'Скрыть навигацию'}
      arrow
      placement='top'
      sx={{ display: 'block' }}
    >
      {isFullscreen ? (
        <IconButton
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setIsFullscreen(false)}
        >
          <FullscreenExitOutlinedIcon />
        </IconButton>
      ) : (
        <IconButton
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setIsFullscreen(true)}
        >
          <FullscreenOutlinedIcon />
        </IconButton>
      )}
    </NavTooltip>
  );
};
