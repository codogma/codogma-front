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
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { GetArticle } from '@/types';

type ButtonAlertDialogProps = {
  readonly lang: string;
  readonly article: GetArticle;
  readonly onClose?: () => void;
};
export default function ButtonAlertDialog({
  lang,
  article,
  onClose,
}: ButtonAlertDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { t } = useTranslation(lang, 'articles');

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    if (onClose) {
      onClose();
    }
    setOpen(true);
  };

  const handleClickEditLinkItem = () => {
    router.push(`/${lang}/article-editor?id=${article.id}`);
    handleClose();
  };

  return (
    <>
      {article.status === 'PUBLISHED' ? (
        <>
          <MenuItem onClick={handleClickOpen} disableRipple>
            <Typography textAlign='center'>
              <EditOutlinedIcon />
              {t('editBtn')}
            </Typography>
          </MenuItem>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle id='alert-dialog-title'>
              {t('dialogTitle')}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id='alert-dialog-description'>
                {t('dialogDescription')}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>{t('disagreeBtn')}</Button>
              <Button onClick={handleClickEditLinkItem}>{t('agreeBtn')}</Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <MenuItem onClick={handleClickEditLinkItem} disableRipple>
          <Typography textAlign='center'>
            <EditOutlinedIcon />
            {t('editBtn')}
          </Typography>
        </MenuItem>
      )}
    </>
  );
}
