'use client';
import TelegramIcon from '@mui/icons-material/Telegram';
import XIcon from '@mui/icons-material/X';
import { Box, Container, Divider, Link, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { usePathname } from 'next/navigation';
import React, { memo } from 'react';

import { Language } from '@/types';

type FooterProps = {
  readonly lang: Language;
  readonly title?: string;
};

function Footer({ lang, title }: FooterProps) {
  const pathname = usePathname();
  const hasAdmin = pathname.startsWith(`/${lang}/admin`);
  if (hasAdmin) {
    return null;
  }
  return (
    <Box className='bg-white py-6 text-white dark:bg-woodsmoke'>
      <Container maxWidth='xl'>
        <Divider sx={{ my: 3, bgcolor: 'grey.700' }} />
        <Box
          sx={{ bgcolor: 'white', color: 'black' }}
          display='flex'
          justifyContent='space-between'
          alignItems='center'
        >
          <Typography variant='body2' color='inherit'>
            © Codogma
          </Typography>
          <Box mt={2} display='flex' justifyContent='center'>
            <Tooltip title={title}>
              <IconButton color='inherit'>
                <Link href='#' color='inherit' title='X'>
                  <XIcon />
                </Link>
              </IconButton>
            </Tooltip>
            <Tooltip title={title}>
              <IconButton color='inherit'>
                <Link href='#' color='inherit' title='Telegram'>
                  <TelegramIcon />
                </Link>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default memo(Footer);
