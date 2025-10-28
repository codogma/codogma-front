'use client';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box } from '@mui/material';
import Fab from '@mui/material/Fab';
import Fade from '@mui/material/Fade';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import * as React from 'react';

import { useScrollContext } from './Scrollbar';

interface Props {
  readonly children: React.ReactNode;
}

function ScrollTop({ children }: Props) {
  const { instance, scrollToTop } = useScrollContext();
  const viewport = instance?.elements().viewport;

  const trigger = useScrollTrigger({
    target: viewport || undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = () => {
    if (!instance) return;
    scrollToTop();
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        sx={{ position: 'fixed', bottom: 120, right: 16, zIndex: 100 }}
      >
        {children}
      </Box>
    </Fade>
  );
}

export const ButtonBackToTop = ({ children }: Props) => {
  return (
    <React.Fragment>
      <div id='back-to-top-anchor' />
      {children}
      <ScrollTop>
        <Fab
          size='small'
          aria-label='scroll back to top'
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            transition: 'background-color 0.3s',
            '&:hover': {
              backgroundColor: 'rgba(112, 112, 112, 0.15)',
            },
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </React.Fragment>
  );
};
