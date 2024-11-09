'use client';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Link from 'next/link';
import React, { useState } from 'react';

import { useTranslation } from '@/app/i18n/client';

type ButtonAlertDialogProps = {
  readonly lang: string;
  readonly articleId: number;
};
export default function ButtonAlertDialog({
  lang,
  articleId,
}: ButtonAlertDialogProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation(lang, 'articles');

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <React.Fragment>
      <Button
        variant='outlined'
        onClick={handleClickOpen}
        className='article-btn'
        startIcon={<EditOutlinedIcon />}
      >
        {t('editBtn')}
      </Button>
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
          <Button onClick={handleClose}>{t('disagreeBtn')}</Button>
          <Button onClick={handleClose}>
            <Link href={`/${lang}/article-editor?id=${articleId}`}>
              {t('agreeBtn')}
            </Link>
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
