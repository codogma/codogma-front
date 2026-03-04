'use client';
import Button from '@mui/material/Button';
import { useTranslations } from 'next-intl';
import React from 'react';

import { CustomDialog } from '@/components/CustomDialog';

type CategoryAlertDialogProps = {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
};

export const CategoryAlertDialog = ({
  open,
  onClose,
  onConfirm,
}: CategoryAlertDialogProps) => {
  const t = useTranslations('categoriesPage');

  return (
    <CustomDialog
      open={open}
      title={t('dialogTitle')}
      contentText={t('dialogDescription')}
      onClose={onClose}
      actions={
        <>
          <Button onClick={onClose}>{t('leaveInSelect')}</Button>
          <Button onClick={onConfirm}>{t('unsubscribeAnyway')}</Button>
        </>
      }
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    />
  );
};
