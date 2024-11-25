'use client';
import Alert from '@mui/material/Alert';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { CustomEventDetail } from '@/types/global';

export default function CustomizedSnackbars() {
  const [open, setOpen] = React.useState(false);
  const [alertText, setAlertText] = useState<string>('');
  const [alertSeverity, setAlertSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('info');

  useEffect(() => {
    const alertChange = (event: CustomEvent<CustomEventDetail>) => {
      setAlertSeverity(event.detail.severity);
      setAlertText(event.detail.message);
      setOpen(true);
    };

    window.addEventListener('api', alertChange);
  }, []);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={alertSeverity}
          variant='filled'
          sx={{ width: '100%' }}
        >
          {alertText}
        </Alert>
      </Snackbar>
    </div>
  );
}
