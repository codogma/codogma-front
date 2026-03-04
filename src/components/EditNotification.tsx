import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, DialogActions, MenuItem, TextField } from '@mui/material';
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

import { CustomDialog } from '@/components/CustomDialog';
import { FormInput } from '@/components/FormInput';
import { languageMenuItems } from '@/constants/i18n';
import {
  getNotificationByIdToUpdate,
  NotificationUpdate,
  updateNotification,
} from '@/helpers/notificationAPI';
import { GetNotificationToUpdate, Language } from '@/types';

// Helper function to convert Record to Map
const recordToMap = (record: Record<string, string>): Map<Language, string> => {
  return new Map(Object.entries(record)) as Map<Language, string>;
};

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
  }) as string | undefined;

  const messageValues = useWatch({
    name: `message.${selectedLang}`,
    control,
  }) as string | undefined;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(zodForm.getValues());
    }
  }, [isSubmitSuccessful, reset, zodForm]);

  const onSubmit: SubmitHandler<z.infer<typeof EditNotificationScheme>> = (
    formData,
  ) => {
    const requestData: NotificationUpdate = {
      title: recordToMap(formData.title),
      message: recordToMap(formData.message),
    };
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
      <CustomDialog
        open={open}
        onClose={handleClose}
        dividers
        title={t('updateNotification')}
      >
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
      </CustomDialog>
    </>
  );
};
