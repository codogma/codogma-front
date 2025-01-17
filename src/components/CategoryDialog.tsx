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
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useTranslation } from '@/app/i18n/client';
import { AvatarImage } from '@/components/AvatarImage';
import FormInput from '@/components/FormInput';
import { createCategory } from '@/helpers/categoryApi';
import { devConsoleError } from '@/helpers/devConsoleLogs';

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

type CategoryDialogProps = {
  readonly lang: string;
  readonly state: boolean;
  readonly onClose: () => void;
};

const CategoryDialogScheme = z.object({
  name: z
    .string()
    .min(2, 'Название категории не может содержать менее 2 символов.')
    .max(50, 'Название категории не может содержать более 50 символов.'),
  image: z.instanceof(File, {
    message: 'Изображение обязательно для загрузки.',
  }),
  description: z.optional(z.string()),
});

export const CategoryDialog = ({
  lang,
  state,
  onClose,
}: CategoryDialogProps) => {
  const [imageFile, setImageFile] = useState<File>();
  const [imageUrl, setImageUrl] = useState<string>();
  const { t } = useTranslation(lang, 'categories');

  const zodForm = useForm<z.infer<typeof CategoryDialogScheme>>({
    resolver: zodResolver(CategoryDialogScheme),
    defaultValues: {
      name: '',
      image: undefined,
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
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
      setValue('image', file);
      trigger('image');
    }
  };

  const onSubmit: SubmitHandler<z.infer<typeof CategoryDialogScheme>> = (
    formData,
  ) => {
    const requestData = { ...formData, image: imageFile };
    devConsoleError(requestData);
    createCategory(requestData).then(() => onClose());
  };

  return (
    <BootstrapDialog aria-labelledby='customized-dialog-title' open={state}>
      <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
        {t('createCategory')}
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
            <FormInput name='name' label={t('name')} variant='standard' />
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
