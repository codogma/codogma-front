import FullscreenExitOutlinedIcon from '@mui/icons-material/FullscreenExitOutlined';
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import { useMediaQuery, useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import React from 'react';

import {
  useNavigationActions,
  useNavigationState,
} from '@/components/NavigationProvider';

export const FullscreenButton = () => {
  const { isFullscreen } = useNavigationState();
  const { setIsFullscreen } = useNavigationActions();
  const theme = useTheme();
  const isMin = useMediaQuery(theme.breakpoints.down('lg'));

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
