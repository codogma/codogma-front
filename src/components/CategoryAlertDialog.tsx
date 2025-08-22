'use client';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

type CategoryAlertDialogProps = {
  readonly onClose?: () => void;
};
export default function CategoryAlertDialog({
  onClose,
}: CategoryAlertDialogProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations('categoriesPage');

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    if (onClose) {
      onClose();
    }
    setOpen(true);
  };

  return (
    <>
      <MenuItem onClick={handleClickOpen} disableRipple>
        <Typography textAlign='center'>
          <EditOutlinedIcon />
          отписаться
        </Typography>
      </MenuItem>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{t('dialogTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {t('dialogDescription')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('leaveInSelect')}</Button>
          <Button>{t('unsubscribeAnyway')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
