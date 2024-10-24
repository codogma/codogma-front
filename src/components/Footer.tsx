'use client';
import TelegramIcon from '@mui/icons-material/Telegram';
import XIcon from '@mui/icons-material/X';
import { Box, Container, Divider, Link, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import React, { memo } from 'react';

type FooterProps = {
  readonly title?: string;
};

function Footer({ title }: FooterProps) {
  return (
    <Box className='bg-limed-spruce py-6 text-white dark:bg-woodsmoke'>
      <Container maxWidth='xl'>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Typography variant='h6' gutterBottom>
              Ваш аккаунт
            </Typography>
            <Link href='#' color='inherit' variant='body2'>
              Профиль
            </Link>
            <br />
            <Link href='#' color='inherit' variant='body2'>
              Трекер
            </Link>
            <br />
            <Link href='#' color='inherit' variant='body2'>
              Диалоги
            </Link>
            <br />
            <Link href='#' color='inherit' variant='body2'>
              Настройки
            </Link>
            <br />
            <Link href='#' color='inherit' variant='body2'>
              ППА
            </Link>
            <br />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Typography variant='h6' gutterBottom>
              Разделы
            </Typography>
            <Link href='#' color='inherit' variant='body2'>
              Статьи
            </Link>
            <br />
            <Link href='#' color='inherit' variant='body2'>
              Новости
            </Link>
            <br />
            <Link href='#' color='inherit' variant='body2'>
              Хабы
            </Link>
            <br />
            <Link href='#' color='inherit' variant='body2'>
              Компании
            </Link>
            <br />
            <Link href='#' color='inherit' variant='body2'>
              Авторы
            </Link>
            <br />
            <Link href='#' color='inherit' variant='body2'>
              Песочница
            </Link>
            <br />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Typography variant='h6' gutterBottom>
              Информация
            </Typography>
            <Link href='#' color='inherit' variant='body2'>
              Устройство сайта
            </Link>
            <br />
            <Link href='#' color='inherit' variant='body2'>
              Для авторов
            </Link>
            <br />
            <Link href='#' color='inherit' variant='body2'>
              Для компаний
            </Link>
            <br />
            <Link href='#' color='inherit' variant='body2'>
              Документы
            </Link>
            <br />
            <Link href='#' color='inherit' variant='body2'>
              Соглашение
            </Link>
            <br />
            <Link href='#' color='inherit' variant='body2'>
              Конфиденциальность
            </Link>
            <br />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Typography variant='h6' gutterBottom>
              Услуги
            </Typography>
            <Link href='#' color='inherit' variant='body2'>
              Корпоративный блог
            </Link>
            <br />
            <Link href='#' color='inherit' variant='body2'>
              Медийная реклама
            </Link>
            <br />
            <Link href='#' color='inherit' variant='body2'>
              Нативные проекты
            </Link>
            <br />
            <Link href='#' color='inherit' variant='body2'>
              Образовательные программы
            </Link>
            <br />
            <Link href='#' color='inherit' variant='body2'>
              Стартапам
            </Link>
            <br />
          </Grid>
        </Grid>
        <Divider sx={{ my: 3, bgcolor: 'grey.700' }} />
        <Box
          sx={{ bgcolor: '#303B44', color: 'white' }}
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
