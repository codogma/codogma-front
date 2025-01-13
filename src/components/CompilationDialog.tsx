import { zodResolver } from '@hookform/resolvers/zod';
import { Close as CloseIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useTranslation } from '@/app/i18n/client';
import FormInput from '@/components/FormInput';
import { createCompilation } from '@/helpers/compilationApi';
import { devConsoleError } from '@/helpers/devConsoleLogs';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

type CompilationDialogProps = {
  readonly lang: string;
  readonly state: boolean;
  readonly onClose: () => void;
};

const CompilationDialogScheme = z.object({
  title: z
    .string()
    .min(2, 'Название подборки не может содержать менее 2 символов.')
    .max(50, 'Название подборки не может содержать более 50 символов.'),
  description: z.optional(z.string()),
});

export const CompilationDialog = ({
  lang,
  state,
  onClose,
}: CompilationDialogProps) => {
  const { t } = useTranslation(lang, 'compilations');

  const zodForm = useForm<z.infer<typeof CompilationDialogScheme>>({
    resolver: zodResolver(CompilationDialogScheme),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = zodForm;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(zodForm.getValues());
    }
  }, [isSubmitSuccessful, reset, zodForm]);

  const onSubmit: SubmitHandler<z.infer<typeof CompilationDialogScheme>> = (
    formData,
  ) => {
    const requestData = { ...formData };
    devConsoleError(requestData);
    createCompilation(requestData).then(() => onClose());
  };

  return (
    <BootstrapDialog aria-labelledby='customized-dialog-title' open={state}>
      <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
        {t('createCompilation')}
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
            <FormInput name='title' label={t('name')} variant='standard' />
            <FormInput
              name='description'
              label={t('description')}
              variant='standard'
            />
            <Button type='submit'>{t('create')}</Button>
          </Box>
        </FormProvider>
      </DialogContent>
    </BootstrapDialog>
  );
};
