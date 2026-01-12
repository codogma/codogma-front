'use client';
import TelegramIcon from '@mui/icons-material/Telegram';
import XIcon from '@mui/icons-material/X';
import { Box, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { usePathname } from 'next/navigation';
import React, { memo } from 'react';

import { Language } from '@/types';

type FooterProps = {
  readonly lang: Language;
};

function Footer({ lang }: FooterProps) {
  const pathname = usePathname();
  const hasAdmin = pathname.startsWith(`/${lang}/admin`);
  if (hasAdmin) {
    return null;
  }

  return (
    <Box className='footer'>
      <Container maxWidth='xl'>
        <Grid
          container
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          spacing={2}
        >
          <Typography variant='body2' className='text-center md:text-left'>
            © {new Date().getFullYear()} Codogma
          </Typography>
          <Box display='flex' gap={1}>
            <IconButton
              aria-label='X'
              href='#'
              className='text-horizon hover:text-curious-blue'
            >
              <XIcon />
            </IconButton>
            <IconButton
              aria-label='Telegram'
              href='#'
              className='text-horizon hover:text-curious-blue'
            >
              <TelegramIcon />
            </IconButton>
          </Box>
        </Grid>
      </Container>
    </Box>
  );
}

export default memo(Footer);
