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
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useTranslation } from '@/app/i18n/client';
import { GithubIcon, GitlabIcon } from '@/components/CustomIcons';
import FormInput from '@/components/FormInput';
import { signUp } from '@/helpers/authApi';
import { generateAvatar } from '@/helpers/generateAvatar';

const SignUpScheme = z.object({
  username: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

export type OAuthProvider = 'github' | 'gitlab';

type PageProps = {
  readonly params: {
    lng: string;
  };
};

export default function Page({ params: { lng } }: PageProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const { t } = useTranslation(lng, 'signUp');

  const zodForm = useForm<z.infer<typeof SignUpScheme>>({
    resolver: zodResolver(SignUpScheme),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = zodForm;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmit: SubmitHandler<z.infer<typeof SignUpScheme>> = async (
    formData,
  ) => {
    try {
      const { username } = formData;
      const file = await generateAvatar(username, 200);
      const requestData = { ...formData, avatar: file };
      await signUp(requestData);
      router.push(`/${lng}/sign-up/success`);
    } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          error?.response?.data || 'An error occurred during registration.';
        setServerError(message);
      }
    }
  };

  const handleOAuth2Redirect = (provider: OAuthProvider) => {
    const redirectSuccessUri = encodeURIComponent(
      window.location.origin + '/profile-update',
    );
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth2/authorization/${provider}?redirect_success_uri=${redirectSuccessUri}`;
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
              onSubmit={handleSubmit(onSubmit)}
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
                disabled={isSubmitSuccessful}
              >
                {isSubmitSuccessful ? t('signingUpBtn') : t('signUpBtn')}
              </Button>
              <Typography sx={{ textAlign: 'center' }}>
                {t('alreadyAccount')}{' '}
                <span>
                  <Link href='/sign-in'>{t('signInBtn')}</Link>
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
