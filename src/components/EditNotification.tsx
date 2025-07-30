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
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useWatch,
} from 'react-hook-form';
import { z } from 'zod';

import FormInput from '@/components/FormInput';
import { languageMenuItems } from '@/constants/i18n';
import {
  getNotificationByIdToUpdate,
  NotificationUpdate,
  updateNotification,
} from '@/helpers/notificationAPI';
import { GetNotificationToUpdate, Language } from '@/types';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

type EditNotificationProps = {
  readonly id: number;
  readonly lang: Language;
  readonly refetch?: () => void;
};

export const EditNotification = ({
  id,
  lang,
  refetch,
}: EditNotificationProps) => {
  const [open, setOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<Language>(lang);
  const t = useTranslations('notificationsPage');

  const EditNotificationScheme = z.object({
    title: z.record(
      z.nativeEnum(Language),
      z
        .string()
        .min(2, t('minTextTitle', { lang: t(selectedLang), length: 2 }))
        .max(50, t('maxTextTitle', { lang: t(selectedLang), length: 50 })),
    ),
    message: z.record(
      z.nativeEnum(Language),
      z
        .string()
        .min(10, t('minTextMessage', { lang: t(selectedLang), length: 10 }))
        .max(
          1000,
          t('maxTextMessage', { lang: t(selectedLang), length: 1000 }),
        ),
    ),
  });

  const { data: notificationData, refetch: refetchNotificationData } =
    useQuery<GetNotificationToUpdate>({
      queryKey: ['notification', id],
      queryFn: () => getNotificationByIdToUpdate(id),
      enabled: false,
    });

  const zodForm = useForm<z.infer<typeof EditNotificationScheme>>({
    resolver: zodResolver(EditNotificationScheme),
    defaultValues: {
      title: notificationData?.title,
      message: notificationData?.message,
    },
  });

  useEffect(() => {
    zodForm.reset({
      title: notificationData?.title,
      message: notificationData?.message,
    });
  }, [notificationData, zodForm]);

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
      reset(zodForm.getValues());
    }
  }, [isSubmitSuccessful, reset, zodForm]);

  const onSubmit: SubmitHandler<z.infer<typeof EditNotificationScheme>> = (
    formData,
  ) => {
    const requestData = {
      title: formData.title,
      message: formData.message,
    } as NotificationUpdate;
    updateNotification(id, requestData).then(() => {
      if (refetch) {
        refetch();
      }
      handleClose();
    });
  };

  const handleClickOpen = () => {
    refetchNotificationData().then(() => setOpen(true));
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button onClick={handleClickOpen}>Редактировать</Button>
      <BootstrapDialog aria-labelledby='customized-dialog-title' open={open}>
        <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
          {t('updateNotification')}
        </DialogTitle>
        <IconButton
          aria-label='close'
          onClick={handleClose}
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
                error={!!errors.message?.ru || !!errors.message?.en}
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
                <Button type='submit'>{t('save')}</Button>
              </DialogActions>
            </Box>
          </FormProvider>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
};
