'use client';
import { Button, Container, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react';

import { useTranslation } from '@/app/i18n/client';

type PageProps = {
  readonly params: {
    lng: string;
  };
};

export default function Page({ params: { lng } }: PageProps) {
  const router = useRouter();

  const handleRedirect = () => {
    router.push(`/${lng}/sign-in`);
  };

  const { t } = useTranslation(lng, 'success');

  return (
    <Container maxWidth='sm' sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant='h4' component='h1' gutterBottom>
        {t('header')}
      </Typography>
      <Typography align='left' variant='body1'>
        {t('text1')}
      </Typography>
      <Typography align='left' variant='body1'>
        {t('text2')}
      </Typography>
      <Typography align='left' variant='body1'>
        {t('text3')}
      </Typography>
      <Typography align='left' variant='body1' sx={{ mb: 4 }}>
        {t('text4')}
      </Typography>
      <Button variant='contained' color='primary' onClick={handleRedirect}>
        {t('button')}
      </Button>
    </Container>
  );
}
