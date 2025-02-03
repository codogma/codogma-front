import { zodResolver } from '@hookform/resolvers/zod';
import { Close as CloseIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useWatch,
} from 'react-hook-form';
import { z } from 'zod';

import { useTranslation } from '@/app/i18n/client';
import FormInput from '@/components/FormInput';
import { languageMenuItems } from '@/constants/i18n';
import { devConsoleInfo } from '@/helpers/devConsoleLogs';
import {
  createNotification,
  NotificationCreate,
} from '@/helpers/notificationAPI';
import { Language } from '@/types';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

type SystemNotificationDialogProps = {
  readonly lang: Language;
  readonly open: boolean;
  readonly onClose: () => void;
};

export const SystemNotificationDialog = ({
  lang,
  open,
  onClose,
}: SystemNotificationDialogProps) => {
  const [selectedLang, setSelectedLang] = useState<Language>(lang);
  const { t } = useTranslation(lang, 'notifications');

  const SystemNotificationDialogScheme = z.object({
    title: z.record(
      z.nativeEnum(Language),
      z.string().min(2, t('minText')).max(50, t('maxText')),
    ),
    message: z.record(
      z.nativeEnum(Language),
      z.string().min(10, t('minTextTitle')).max(1000, t('maxTextTitle')),
    ),
  });

  const zodForm = useForm<z.infer<typeof SystemNotificationDialogScheme>>({
    resolver: zodResolver(SystemNotificationDialogScheme),
    defaultValues: {
      title: {
        en: '',
        ru: '',
      },
      message: {
        en: '',
        ru: '',
      },
    },
  });

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitSuccessful, errors },
  } = zodForm;

  const titleValues = useWatch({
    name: `title.${selectedLang}`,
    control,
  }) as Record<string, string>;

  const messageValues = useWatch({
    name: `message.${selectedLang}`,
    control,
  }) as Record<string, string>;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        title: {
          en: '',
          ru: '',
        },
        message: {
          en: '',
          ru: '',
        },
      });
      setSelectedLang(lang);
    }
  }, [isSubmitSuccessful, lang, reset]);

  const onSubmit: SubmitHandler<
    z.infer<typeof SystemNotificationDialogScheme>
  > = async (formData) => {
    const requestData = {
      title: formData.title,
      message: formData.message,
    } as NotificationCreate;
    devConsoleInfo(requestData);
    await createNotification(requestData);
    onClose();
  };

  return (
    <BootstrapDialog aria-labelledby='customized-dialog-title' open={open}>
      <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
        {t('createNotification')}
      </DialogTitle>
      <IconButton
        aria-label='close'
        onClick={onClose}
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <FormProvider {...zodForm}>
          <Box
            noValidate
            component='form'
            autoComplete='off'
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
              minWidth: 420,
              width: 'fit-content',
              gap: 2,
            }}
          >
            <TextField
              select
              label={t('language')}
              variant='standard'
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value as Language)}
            >
              {languageMenuItems.map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
            <FormInput
              key={`title-${selectedLang}`}
              name={`title.${selectedLang}`}
              required
              label={t('title')}
              variant='standard'
              value={titleValues}
              error={!!errors.title?.ru || !!errors.title?.en}
              helperText={
                (!!errors.title?.[selectedLang] &&
                  errors.title?.[selectedLang].message?.replace(
                    '{}',
                    t(selectedLang.toLowerCase()),
                  )) ||
                (!!errors.title?.ru &&
                  errors.title?.ru?.message?.replace('{}', t('ru'))) ||
                (!!errors.title?.en &&
                  errors.title?.en?.message?.replace('{}', t('en')))
              }
            />
            <FormInput
              key={`message-${selectedLang}`}
              name={`message.${selectedLang}`}
              required
              label={t('message')}
              variant='standard'
              value={messageValues}
              error={!!errors.title?.ru || !!errors.title?.en}
              helperText={
                (!!errors.message?.[selectedLang] &&
                  errors.message?.[selectedLang].message?.replace(
                    '{}',
                    t(selectedLang.toLowerCase()),
                  )) ||
                (!!errors.message?.ru &&
                  errors.message?.ru?.message?.replace('{}', t('ru'))) ||
                (!!errors.message?.en &&
                  errors.message?.en?.message?.replace('{}', t('en')))
              }
            />
            <DialogActions>
              <Button type='submit'>{t('create')}</Button>
            </DialogActions>
          </Box>
        </FormProvider>
      </DialogContent>
    </BootstrapDialog>
  );
};
