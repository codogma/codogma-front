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
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: 'rgba(102, 126, 234, 0.2)',
              transform: 'scale(1.1) translateY(-2px)',
              boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
          }}
        >
          <KeyboardArrowUpIcon
            sx={{
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </Fab>
      </ScrollTop>
    </React.Fragment>
  );
};
