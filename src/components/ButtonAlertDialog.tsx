'use client';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { GetArticle, Language } from '@/types';

import { CustomDialog } from './CustomDialog';

type ButtonAlertDialogProps = {
  readonly lang: Language;
  readonly article: GetArticle;
  readonly onClose?: () => void;
};

export const ButtonAlertDialog = ({
  lang,
  article,
  onClose,
}: ButtonAlertDialogProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations('articlesPage');

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
      {article.status !== 'DRAFT' ? (
        <>
          <MenuItem onClick={handleClickOpen} disableRipple>
            <Typography textAlign='center'>
              <EditOutlinedIcon />
              {t('editBtn')}
            </Typography>
          </MenuItem>
          <CustomDialog
            open={open}
            onClose={handleClose}
            title={t('dialogTitle')}
            contentText={t('dialogDescription')}
            actions={
              <>
                <Button onClick={handleClose}>{t('disagreeBtn')}</Button>
                <Button onClick={handleClickEditLinkItem}>
                  {t('agreeBtn')}
                </Button>
              </>
            }
          />
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
};
