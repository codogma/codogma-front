'use client';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import clsx from 'clsx';
import * as React from 'react';
import { FC } from 'react';

interface SpinnerProps {
  className?: string;
}

function GradientCircularProgress() {
  return (
    <React.Fragment>
      <svg width={0} height={0} className='gradient-circular-progress'>
        <defs>
          <linearGradient id='my_gradient' x1='0%' y1='0%' x2='0%' y2='100%'>
            <stop className='first-stop' offset='0%' />
            <stop className='second-stop' offset='100%' />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress
        size={60}
        sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }}
      />
    </React.Fragment>
  );
}

export const Spinner: FC<SpinnerProps> = ({ className }) => {
  return (
    <Stack spacing={2} className={clsx('global-spinner', className)}>
      <GradientCircularProgress />
    </Stack>
  );
};
