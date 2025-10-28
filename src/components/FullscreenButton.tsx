'use client';
import FullscreenExitOutlinedIcon from '@mui/icons-material/FullscreenExitOutlined';
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react';

import { useNavigation } from '@/components/NavigationProvider';

export const FullscreenButton = () => {
  const { isFullscreen, setIsFullscreen } = useNavigation();
  const theme = useTheme();
  const isMin = useMediaQuery(theme.breakpoints.down('lg'));

  // TODO переписать через Checkbox
  return (
    <Tooltip
      title={isFullscreen ? 'Показать навигацию' : 'Скрыть навигацию'}
      arrow
      placement={isFullscreen || isMin ? 'top' : 'left'}
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
    </Tooltip>
  );
};
