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
import { useAuth } from '@/components/AuthProvider';
import { AvatarImage } from '@/components/AvatarImage';
import FormInput from '@/components/FormInput';
import { updateCategory } from '@/helpers/categoryApi';
import { devConsoleError } from '@/helpers/devConsoleLogs';
import { Category } from '@/types';

const EditCategoryScheme = z.object({
  name: z.optional(
    z
      .string()
      .min(2, 'Название категории не может содержать менее 2 символов.')
      .max(50, 'Название категории не может содержать более 50 символов.'),
  ),
  image: z.optional(z.instanceof(File)),
  description: z.optional(z.string()),
});

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

type EditCategoryProps = {
  readonly id: number;
  readonly lang: string;
  readonly categoryData: Category;
  readonly refetch?: () => void;
};

export const EditCategory = ({
  id,
  lang,
  categoryData,
  refetch,
}: EditCategoryProps) => {
  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File>();
  const [category, setCategory] = useState<Category>(categoryData);
  const { t } = useTranslation(lang, 'categories');
  const { state } = useAuth();

  const zodForm = useForm<z.infer<typeof EditCategoryScheme>>({
    resolver: zodResolver(EditCategoryScheme),
    defaultValues: {
      name: '',
      image: undefined,
      description: '',
    },
  });

  useEffect(() => {
    zodForm.reset({
      name: categoryData.name,
      image: undefined,
      description: categoryData.description,
    });
  }, [categoryData, zodForm]);

  const {
    reset,
    handleSubmit,
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
      setCategory((prev) =>
        prev ? { ...prev, imageUrl: URL.createObjectURL(file) } : prev,
      );
    }
  };

  const onSubmit: SubmitHandler<z.infer<typeof EditCategoryScheme>> = (
    formData,
  ) => {
    const requestData = { ...formData, image: imageFile };
    devConsoleError(requestData);
    updateCategory(id, requestData).then(() => {
      if (refetch) {
        refetch();
      }
      handleClose();
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        className='article-btn'
        variant='outlined'
        onClick={handleClickOpen}
      >
        Редактировать
      </Button>
      <BootstrapDialog aria-labelledby='customized-dialog-title' open={open}>
        <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
          {t('updateCategory')}
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
              <span>
                <Badge
                  overlap='circular'
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <IconButton component='label' color='inherit' sx={{ p: 0 }}>
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
                    alt={category?.name}
                    variant='rounded'
                    src={category?.imageUrl}
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
              <Button type='submit'>{t('save')}</Button>
            </Box>
          </FormProvider>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
};
