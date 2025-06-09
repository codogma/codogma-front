'use client';
import { Button } from '@mui/material';
import { ReactNode } from 'react';

import { useT } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import { Language } from '@/types';

type SignInProps = {
  readonly children: ReactNode;
  readonly lang: Language;
};

export const SignIn = ({ children, lang }: SignInProps) => {
  const { t } = useT();
  const {
    state: { isAuthenticated },
  } = useAuth();
  return isAuthenticated ? (
    children
  ) : (
    <>
      <h1>Log in and we'll show you your subscriptions</h1>
      <p>And if you don't have an account, sign up.</p>
      <p>Then your subscriptions will be here.</p>
      <Button href={`/${lang}/sign-in`}>{t('signIn')}</Button>
    </>
  );
};
