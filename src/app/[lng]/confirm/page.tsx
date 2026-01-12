'use client';

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { confirmEmail } from '@/helpers/authApi';

type ErrorData = string | { message?: string };

export default function Page() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  const [confirmationStatus, setConfirmationStatus] = useState<
    'loading' | 'success' | 'error'
  >('loading');
  const [message, setMessage] = useState('');

  const router = useRouter();

  useEffect(() => {
    if (!token) {
      setConfirmationStatus('error');
      setMessage('Token is missing or invalid.');
      return;
    }

    const run = async () => {
      try {
        const response = await confirmEmail(token); // <- должен быть string
        setConfirmationStatus('success');
        setMessage(response);
      } catch (err: unknown) {
        setConfirmationStatus('error');

        if (axios.isAxiosError<ErrorData>(err)) {
          const status = err.response?.status;
          const data = err.response?.data;

          if (status === 400) {
            const text =
              typeof data === 'string'
                ? data
                : (data?.message ??
                  'Email has already been confirmed or token has expired.');
            setMessage(text);
          } else {
            setMessage('An error occurred while confirming your email.');
          }
          return;
        }

        // не axios-ошибка
        if (err instanceof Error) {
          setMessage(err.message);
        } else {
          setMessage('An error occurred while confirming your email.');
        }
      }
    };

    void run();
  }, [token]);

  return (
    <Container maxWidth='sm' sx={{ textAlign: 'center', mt: 8 }}>
      {confirmationStatus === 'loading' && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 100,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {confirmationStatus === 'success' && (
        <>
          <Alert severity='success' sx={{ mb: 4 }}>
            {message}
          </Alert>
          <Typography variant='h4' component='h1' gutterBottom>
            Email Confirmed
          </Typography>
          <Typography variant='body1' sx={{ mb: 4 }}>
            Thank you for confirming your email. You can now sign in to your
            account.
          </Typography>
          <Button variant='contained' onClick={() => router.push('/sign-in')}>
            Go to Sign In
          </Button>
        </>
      )}

      {confirmationStatus === 'error' && (
        <>
          <Alert severity='error' sx={{ mb: 4 }}>
            {message}
          </Alert>
          <Typography variant='h5' component='h1' gutterBottom>
            Email Confirmation Failed
          </Typography>
          <Typography variant='body1' sx={{ mb: 4 }}>
            Something went wrong during the confirmation process. Please try
            again.
          </Typography>
          <Button
            variant='contained'
            onClick={() => router.push('/resend-confirmation')}
          >
            Resend Confirmation Email
          </Button>
        </>
      )}
    </Container>
  );
}
