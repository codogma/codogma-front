'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { GithubIcon, GitlabIcon } from '@/components/CustomIcons';
import ForgotPassword from '@/components/ForgotPassword';
import FormInput from '@/components/FormInput';
import { currentUser, login } from '@/helpers/authApi';
import { Language } from '@/types';

const SignInScheme = z.object({
  usernameOrEmail: z.string().min(1, { message: 'Name is required' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

export type OAuthProvider = 'github' | 'gitlab';

type PageProps = {
  readonly params: {
    lng: Language;
  };
};

export default function Page({ params: { lng } }: PageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('signInPage');
  const { status } = useSession();
  const [serverError, setServerError] = useState('');
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(`/${lng}/`);
    }
  }, [status, router, lng]);

  const zodForm = useForm<z.infer<typeof SignInScheme>>({
    resolver: zodResolver(SignInScheme),
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
  });

  const { handleSubmit } = zodForm;

  const { mutate: signInMutation, isPending: signInIsPending } = useMutation({
    mutationFn: async (formData: z.infer<typeof SignInScheme>) => {
      const data = await login(formData);
      if (data) {
        const result = await signIn('credentials', {
          ...data,
          redirect: false,
        });
        if (result?.error) throw new Error('Failed to sign in');
        return result;
      }
      throw new Error('Empty response');
    },
    onSuccess: (result) => {
      if (result?.ok) {
        router.push(`/${lng}/`);
      }
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const message =
          error?.response?.data ?? 'An error occurred during sign in';
        setServerError(message);
      } else {
        setServerError(error?.message || 'An error occurred during sign in');
      }
    },
  });

  const { mutate: oauthSignInMutation, isPending: oauthIsPending } =
    useMutation({
      mutationFn: async () => {
        const data = await currentUser();
        const result = await signIn('credentials', {
          ...data,
          redirect: false,
        });
        if (!result?.ok || result?.error) throw new Error('Failed to sign in');
        return result;
      },
      onSuccess: () => {
        router.push(`/${lng}/`);
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          const message =
            error?.response?.data ?? 'An error occurred during sign in';
          setServerError(message);
        } else {
          setServerError(error?.message || 'An error occurred during sign in');
        }
      },
    });

  useEffect(() => {
    const oauthSuccess = searchParams.get('oauth_success');
    if (oauthSuccess === 'true') {
      oauthSignInMutation();
    } else if (oauthSuccess === 'false') {
      setServerError('OAuth2 authorization failed');
    }
  }, [oauthSignInMutation, searchParams]);

  if (oauthIsPending) {
    return (
      <Container
        sx={{
          direction: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Stack sx={{ justifyContent: 'center', alignItems: 'center', p: 2 }}>
          <CircularProgress size={40} />
          <Typography sx={{ mt: 2 }}>Completing OAuth2 login...</Typography>
        </Stack>
      </Container>
    );
  }

  const handleOAuth2Redirect = (provider: OAuthProvider) => {
    const currentUrl = window.location.origin + window.location.pathname;
    const redirectSuccessUri = encodeURIComponent(
      `${currentUrl}?oauth_success=true`,
    );
    const redirectErrorUri = encodeURIComponent(
      `${currentUrl}?oauth_success=false`,
    );
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth2/authorization/${provider}?redirect_success_uri=${redirectSuccessUri}&redirect_error_uri=${redirectErrorUri}`;
  };

  return (
    <Container sx={{ direction: 'column', justifyContent: 'space-between' }}>
      <Stack
        sx={{
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Card
          className='mx-auto flex w-full flex-col gap-2 self-center p-4 sm:w-[450px]'
          variant='outlined'
        >
          <Typography
            component='h1'
            variant='h4'
            sx={{
              textAlign: 'center',
              width: '100%',
              fontSize: 'clamp(1.25rem, 10vw, 1.5rem)',
            }}
          >
            {t('signIn')}
          </Typography>
          <FormProvider {...zodForm}>
            <Box
              component='form'
              onSubmit={handleSubmit((data) => signInMutation(data))}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <FormInput
                id='usernameOrEmail'
                name='usernameOrEmail'
                label={t('usernameOrEmail')}
                fullWidth
                variant='standard'
                autoComplete='off'
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Link href='#' onClick={handleClickOpen}>
                  {t('forgotPassword')}
                </Link>
              </Box>
              <FormInput
                id='password'
                name='password'
                label={t('password')}
                fullWidth
                type='password'
                variant='standard'
                autoComplete='new-password'
              />
              <FormControlLabel
                control={<Checkbox value='remember' color='primary' />}
                label={t('rememberMe')}
              />
              <ForgotPassword open={open} handleClose={handleClose} />
              {serverError && (
                <Typography sx={{ textAlign: 'center' }} color='error'>
                  {serverError}
                </Typography>
              )}
              <Button
                type='submit'
                fullWidth
                variant='contained'
                disabled={signInIsPending}
                startIcon={
                  signInIsPending ? <CircularProgress size={20} /> : null
                }
              >
                {signInIsPending ? t('signingInBtn') : t('signInBtn')}
              </Button>
              <Typography sx={{ textAlign: 'center' }}>
                {t('haveAccount')}{' '}
                <span>
                  <Link href={`/sign-up`}>{t('signUpBtn')}</Link>
                </span>
              </Typography>
            </Box>
          </FormProvider>
          <Divider>{t('or')}</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              type='submit'
              fullWidth
              variant='outlined'
              onClick={() => handleOAuth2Redirect('github')}
              startIcon={<GithubIcon />}
            >
              {t('githubBtn')}
            </Button>
            <Button
              type='submit'
              fullWidth
              variant='outlined'
              onClick={() => handleOAuth2Redirect('gitlab')}
              startIcon={<GitlabIcon />}
            >
              {t('gitlabBtn')}
            </Button>
          </Box>
        </Card>
      </Stack>
    </Container>
  );
}
