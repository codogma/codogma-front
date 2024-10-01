'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material';
import { confirmEmail } from '@/helpers/authApi';

export default function Page() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
  const [confirmationStatus, setConfirmationStatus] = useState<
    'loading' | 'success' | 'error'
  >('loading');
  const [message, setMessage] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    if (token) {
      confirmEmail(token)
        .then((response) => {
          setConfirmationStatus('success');
          setMessage(response);
        })
        .catch((error) => {
          setConfirmationStatus('error');
          if (error.response?.status === 400) {
            setMessage(
              error.response.data ||
                'Email has already been confirmed or token has expired.',
            );
          } else {
            setMessage('An error occurred while confirming your email.');
          }
        });
    } else {
      setConfirmationStatus('error');
      setMessage('Token is missing or invalid.');
    }
  }, [token]);

  const handleRedirect = () => {
    router.push('/sign-in');
  };

  return (
    <Container maxWidth='sm' sx={{ textAlign: 'center', mt: 8 }}>
      {confirmationStatus === 'loading' && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
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
          <Button variant='contained' color='primary' onClick={handleRedirect}>
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
            color='primary'
            onClick={() => router.push('/resend-confirmation')}
          >
            Resend Confirmation Email
          </Button>
        </>
      )}
    </Container>
  );
}
