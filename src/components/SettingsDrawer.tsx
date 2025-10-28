import CloseIcon from '@mui/icons-material/Close';
import SettingsApplicationsOutlinedIcon from '@mui/icons-material/SettingsApplicationsOutlined';
import {
  Divider,
  Drawer,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';

import { DrawerHeader } from '@/components/DrawerHeader';
import { useNavigation } from '@/components/NavigationProvider';
import { Scrollbar } from '@/components/Scrollbar';
import { getNumber, getString } from '@/helpers/localStorage';

export const SettingsDrawer = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { isFullscreen } = useNavigation();
  const [fontSize, setFontSize] = useState<number>(() =>
    getNumber('fontSize', 1),
  );
  const [contentWidth, setContentWidth] = useState<number>(() =>
    getNumber('contentWidth', 70),
  );
  const [fontFamily, setFontFamily] = useState<string>(() =>
    getString('fontFamily', 'var(--font-sans)'),
  );

  useEffect(() => {
    if (open) {
      setFontSize(() => getNumber('fontSize', 1));
      setContentWidth(() => getNumber('contentWidth', 70));
      setFontFamily(() => getString('fontFamily', 'var(--font-sans)'));
    }
  }, [open]);

  useEffect(() => {
    const articleContent = document.getElementById('article-content');
    if (articleContent) {
      articleContent.style.fontSize = `${fontSize}rem`;
      articleContent.style.maxWidth = `${contentWidth}ch`;
      articleContent.style.fontFamily = fontFamily;
    }
  }, [contentWidth, fontFamily, fontSize]);

  const handleFontSizeChange = (
    _: React.MouseEvent<HTMLElement>,
    value: number,
  ) => {
    if (value !== null) {
      localStorage.setItem('fontSize', String(value));
      setFontSize(value);
    }
  };

  const handleContentWidthChange = (
    _: React.MouseEvent<HTMLElement>,
    value: number,
  ) => {
    if (value !== null) {
      localStorage.setItem('contentWidth', String(value));
      setContentWidth(value);
    }
  };

  const handleFontFamilyChange = (
    _: React.MouseEvent<HTMLElement>,
    value: string,
  ) => {
    if (value !== null) {
      localStorage.setItem('fontFamily', String(value));
      setFontFamily(value);
    }
  };

  const SettingsDrawer = (
    <Drawer
      anchor='right'
      sx={{
        display: 'block',
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          maxWidth: 600,
          height: '100vh',
        },
      }}
      onClose={() => setOpen(false)}
      onKeyDown={() => setOpen(false)}
      open={open}
      keepMounted
    >
      <DrawerHeader>
        <Stack spacing={1} direction='row' sx={{ alignItems: 'center' }}>
          <SettingsApplicationsOutlinedIcon />
          <Typography variant='h6'>Настройки:</Typography>
        </Stack>
        <IconButton onClick={() => setOpen(false)}>
          <CloseIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <Typography
        component='div'
        variant='body2'
        sx={{
          mt: 2,
          mb: 1,
          textAlign: 'center',
          textTransform: 'uppercase',
        }}
      >
        Размер шрифта
      </Typography>
      <ToggleButtonGroup
        value={fontSize}
        exclusive
        onChange={handleFontSizeChange}
        fullWidth
        sx={{ px: 2, mb: 2 }}
      >
        <ToggleButton value={1}>Small</ToggleButton>
        <ToggleButton value={1.3}>Medium</ToggleButton>
        <ToggleButton value={1.5}>Large</ToggleButton>
      </ToggleButtonGroup>
      <Divider />
      <Typography
        component='div'
        variant='body2'
        sx={{
          mt: 2,
          mb: 1,
          textAlign: 'center',
          textTransform: 'uppercase',
        }}
      >
        Ширина контента
      </Typography>
      <ToggleButtonGroup
        value={contentWidth}
        exclusive
        onChange={handleContentWidthChange}
        fullWidth
        sx={{ px: 2, mb: 2 }}
      >
        <ToggleButton value={50}>Small</ToggleButton>
        <ToggleButton value={70}>Medium</ToggleButton>
        <ToggleButton value={90}>Large</ToggleButton>
      </ToggleButtonGroup>
      <Divider />
      <Typography
        component='div'
        variant='body2'
        sx={{
          mt: 2,
          mb: 1,
          textAlign: 'center',
          textTransform: 'uppercase',
        }}
      >
        Стиль шрифта
      </Typography>
      <ToggleButtonGroup
        value={fontFamily}
        exclusive
        onChange={handleFontFamilyChange}
        fullWidth
        sx={{ px: 2, mb: 2 }}
      >
        <ToggleButton value='var(--font-sans)'>Без засечек</ToggleButton>
        <ToggleButton value='var(--font-serif)'>С засечками</ToggleButton>
        <ToggleButton value='var(--font-mono)'>Моноширинный</ToggleButton>
      </ToggleButtonGroup>
      <Scrollbar style={{ height: '100%' }}></Scrollbar>
    </Drawer>
  );

  return (
    <>
      <Tooltip
        title='Настройки'
        arrow
        placement={isFullscreen ? 'top' : 'left'}
        sx={{ display: 'block' }}
      >
        <IconButton
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setOpen(true)}
        >
          <SettingsApplicationsOutlinedIcon />
        </IconButton>
      </Tooltip>
      {SettingsDrawer}
    </>
  );
};
