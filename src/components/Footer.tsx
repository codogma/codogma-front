'use client';
import TelegramIcon from '@mui/icons-material/Telegram';
import XIcon from '@mui/icons-material/X';
import { Box, Container, Divider, Link, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import React, { memo } from 'react';

type FooterProps = {
  readonly title?: string;
};

function Footer({ title }: FooterProps) {
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
          <Box>
            <Link href='#' color='inherit'>
              Техническая поддержка
            </Link>{' '}
            |
            <Link href='#' color='inherit'>
              Настройка языка
            </Link>
          </Box>
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
