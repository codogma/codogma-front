import CloseIcon from '@mui/icons-material/Close';
import SettingsApplicationsOutlinedIcon from '@mui/icons-material/SettingsApplicationsOutlined';
import { Divider, Drawer } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';

import { DrawerHeader } from '@/components/DrawerHeader';
import { Scrollbar } from '@/components/Scrollbar';

export const SettingsDrawer = () => {
  const [openSettings, setOpenSettings] = useState<boolean>(false);

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
      onClose={() => setOpenSettings(false)}
      onKeyDown={() => setOpenSettings(false)}
      open={openSettings}
      slotProps={{
        root: {
          keepMounted: true,
        },
      }}
    >
      <DrawerHeader>
        <Stack spacing={1} direction='row' sx={{ alignItems: 'center' }}>
          <SettingsApplicationsOutlinedIcon />
          <Typography variant='h6'>Настройки:</Typography>
        </Stack>
        <IconButton onClick={() => setOpenSettings(false)}>
          <CloseIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <Scrollbar style={{ height: '100%' }}></Scrollbar>
    </Drawer>
  );

  return (
    <>
      <Tooltip
        title='Настройки'
        arrow
        placement='left'
        sx={{ display: 'block' }}
      >
        <IconButton
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setOpenSettings(true)}
        >
          <SettingsApplicationsOutlinedIcon />
        </IconButton>
      </Tooltip>
      {SettingsDrawer}
    </>
  );
};
