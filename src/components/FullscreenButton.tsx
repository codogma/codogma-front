import FullscreenExitOutlinedIcon from '@mui/icons-material/FullscreenExitOutlined';
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
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

  return (
    <Tooltip
      title={isFullscreen ? 'Показать навигацию' : 'Скрыть навигацию'}
      arrow
      placement={isFullscreen ? 'top' : 'left'}
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
