'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import { GithubIcon, GitlabIcon } from '@/components/CustomIcons';
import ForgotPassword from '@/components/ForgotPassword';
import FormInput from '@/components/FormInput';
import { signIn } from '@/helpers/authApi';

const SignInScheme = z.object({
  usernameOrEmail: z.string().min(1, { message: 'Name is required' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

type PageParams = {
  lng: string;
};

type PageProps = {
  readonly params: PageParams;
};

export type OAuthProvider = 'github' | 'gitlab';

export default function Page({ params: { lng } }: PageProps) {
  const router = useRouter();
  const { dispatch } = useAuth();
  const [serverError, setServerError] = useState('');
  const { t } = useTranslation(lng, 'signIn');
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const zodForm = useForm<z.infer<typeof SignInScheme>>({
    resolver: zodResolver(SignInScheme),
    defaultValues: {
      usernameOrEmail: '',
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

  const onSubmit: SubmitHandler<z.infer<typeof SignInScheme>> = async (
    formData,
  ) => {
    try {
      const loggedInUser = await signIn(formData);
      dispatch({ type: 'LOGIN', user: loggedInUser });
      router.push(`/`);
    } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          error?.response?.data || 'An error occurred during sign in.';
        setServerError(message);
      }
    }
  };

  const handleOAuth2Redirect = (provider: OAuthProvider) => {
    const redirectSuccessUri = encodeURIComponent(window.location.origin + '/');
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
            {t('signIn')}
          </Typography>
          <FormProvider {...zodForm}>
            <Box
              component='form'
              onSubmit={handleSubmit(onSubmit)}
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
                disabled={isSubmitSuccessful}
              >
                {isSubmitSuccessful ? t('signingInBtn') : t('signInBtn')}
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
