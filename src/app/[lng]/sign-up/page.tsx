'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import React, { use, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { GithubIcon, GitlabIcon } from '@/components/CustomIcons';
import { FormInput } from '@/components/FormInput';
import { currentUser, signUp } from '@/helpers/authApi';
import { generateAvatar } from '@/helpers/generateAvatar';
import { AuthDTO } from '@/types';

const SignUpScheme = z.object({
  username: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

export type OAuthProvider = 'github' | 'gitlab';

type PageProps = {
  readonly params: Promise<{ lng: string }>;
};

type ErrorData = string | { message?: string };

function extractAxiosMessage(e: AxiosError<ErrorData>): string {
  const data = e.response?.data;
  if (typeof data === 'string') return data;
  return data?.message ?? 'An error occurred during sign in';
}

export default function Page({ params }: PageProps) {
  const { lng } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const [serverError, setServerError] = useState('');
  const t = useTranslations('signUpPage');

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(`/${lng}/`);
    }
  }, [status, router, lng]);

  const zodForm = useForm<z.infer<typeof SignUpScheme>>({
    resolver: zodResolver(SignUpScheme),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const { handleSubmit } = zodForm;

  const { mutate: signUpMutation, isPending: signUpIsPending } = useMutation({
    mutationFn: async (formData: z.infer<typeof SignUpScheme>) => {
      const { username } = formData;
      const file = await generateAvatar(username, 200);
      const requestData = { ...formData, avatar: file };
      await signUp(requestData);
    },
    onSuccess: () => {
      router.push(`/${lng}/sign-up/success`);
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError<ErrorData>(error)) {
        setServerError(extractAxiosMessage(error));
        return;
      }
      if (error instanceof Error) {
        setServerError(error.message);
        return;
      }
      setServerError('An error occurred during sign up');
    },
  });

  const { mutate: oauthSignInMutation, isPending: oauthIsPending } =
    useMutation({
      mutationFn: async () => {
        const data: AuthDTO = await currentUser();
        const result = await signIn('credentials', {
          ...data,
          redirect: false,
        });
        if (!result?.ok || result?.error) throw new Error('Failed to sign in');
        return result;
      },
      onSuccess: () => {
        router.push(`/${lng}/profile-update`);
      },
      onError: (error: unknown) => {
        if (axios.isAxiosError<ErrorData>(error)) {
          setServerError(extractAxiosMessage(error));
          return;
        }
        if (error instanceof Error) {
          setServerError(error.message);
          return;
        }
        setServerError('An error occurred during sign up');
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
            {t('createAccount')}
          </Typography>
          <FormProvider {...zodForm}>
            <Box
              component='form'
              onSubmit={handleSubmit((data) => signUpMutation(data))}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <FormInput
                id='username'
                name='username'
                label={t('username')}
                fullWidth
                variant='standard'
                autoComplete='off'
              />
              <FormInput
                id='email'
                name='email'
                label={t('email')}
                fullWidth
                variant='standard'
                autoComplete='off'
              />
              <FormInput
                id='password'
                name='password'
                label={t('password')}
                fullWidth
                type='password'
                variant='standard'
                autoComplete='new-password'
              />
              {serverError && (
                <Typography sx={{ textAlign: 'center' }} color='error'>
                  {serverError}
                </Typography>
              )}
              <Button
                type='submit'
                fullWidth
                variant='contained'
                disabled={signUpIsPending}
                startIcon={
                  signUpIsPending ? <CircularProgress size={20} /> : null
                }
              >
                {signUpIsPending ? t('signingUpBtn') : t('signUpBtn')}
              </Button>
              <Typography sx={{ textAlign: 'center' }}>
                {t('alreadyAccount')}{' '}
                <span>
                  <Link href={`/sign-in`}>{t('signInBtn')}</Link>
                </span>
              </Typography>
            </Box>
          </FormProvider>
          <Divider>
            <Typography sx={{ color: 'text.secondary' }}>{t('or')}</Typography>
          </Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant='outlined'
              onClick={() => handleOAuth2Redirect('github')}
              startIcon={<GithubIcon />}
            >
              {t('githubBtn')}
            </Button>
            <Button
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
