import { zodResolver } from '@hookform/resolvers/zod';
import {
  Close as CloseIcon,
  ModeEditOutlineOutlined,
} from '@mui/icons-material';
import {
  Badge,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormHelperText,
  IconButton,
} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import { styled } from '@mui/material/styles';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { AvatarImage } from '@/components/AvatarImage';
import FormInput from '@/components/FormInput';
import { CompilationCreate, createCompilation } from '@/helpers/compilationApi';
import { devConsoleWarn } from '@/helpers/devConsoleLogs';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

type CompilationDialogProps = {
  readonly open: boolean;
  readonly onClose: () => void;
};

const CompilationDialogScheme = z.object({
  image: z.optional(z.instanceof(File)),
  title: z
    .string()
    .min(2, 'Название подборки не может содержать менее 2 символов.')
    .max(50, 'Название подборки не может содержать более 50 символов.'),
  description: z.optional(z.string()),
});

export const CompilationDialog = ({
  open,
  onClose,
}: CompilationDialogProps) => {
  const [imageUrl, setImageUrl] = useState<string>();
  const t = useTranslations('compilationsPage');

  const zodForm = useForm<z.infer<typeof CompilationDialogScheme>>({
    resolver: zodResolver(CompilationDialogScheme),
    defaultValues: {
      image: undefined,
      title: '',
      description: '',
    },
  });

  const {
    reset,
    handleSubmit,
    setValue,
    trigger,
    formState: { isSubmitSuccessful, errors },
  } = zodForm;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(zodForm.getValues());
    }
  }, [isSubmitSuccessful, reset, zodForm]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
      setValue('image', file);
      trigger('image');
    }
  };

  const onSubmit: SubmitHandler<z.infer<typeof CompilationDialogScheme>> = (
    formData,
  ) => {
    const requestData = {
      title: formData.title,
      image: formData.image,
      description: formData.description,
    };
    const formDataToSend = new FormData();
    formDataToSend.append('title', JSON.stringify(requestData.title));
    if (requestData.image) formDataToSend.append('image', requestData.image);
    if (requestData.description) {
      formDataToSend.append(
        'description',
        JSON.stringify(requestData.description),
      );
    }
    const formDataObject = Object.fromEntries(
      formDataToSend.entries(),
    ) as unknown as CompilationCreate;
    devConsoleWarn(formDataObject);
    createCompilation(formDataObject).then(() => onClose());
  };

  return (
    <BootstrapDialog aria-labelledby='customized-dialog-title' open={open}>
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
            <span>
              <Badge
                overlap='circular'
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <IconButton
                    component='label'
                    color='inherit'
                    sx={{ p: 0, m: 0 }}
                  >
                    <ModeEditOutlineOutlined color='primary' />
                    <VisuallyHiddenInput
                      id='image'
                      name='image'
                      type='file'
                      onChange={handleFileChange}
                    />
                  </IconButton>
                }
              >
                <AvatarImage
                  type='image'
                  variant='rounded'
                  src={imageUrl}
                  size={112}
                  fontSize='large'
                />
              </Badge>
            </span>
            {errors.image && (
              <FormHelperText id='image-text' error={!!errors.image}>
                {errors?.image.message}
              </FormHelperText>
            )}
            <FormInput
              name='title'
              required
              label={t('name')}
              variant='standard'
            />
            <FormInput
              name='description'
              label={t('description')}
              variant='standard'
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
