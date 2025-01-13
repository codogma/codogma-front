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
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useTranslation } from '@/app/i18n/client';
import { AvatarImage } from '@/components/AvatarImage';
import FormInput from '@/components/FormInput';
import {
  getCompilationById,
  updateCompilation,
} from '@/helpers/compilationApi';
import { devConsoleError } from '@/helpers/devConsoleLogs';
import { GetCompilation } from '@/types';

const EditCompilationScheme = z.object({
  image: z.optional(z.instanceof(File)),
  title: z.optional(
    z
      .string()
      .min(2, 'Название подборки не может содержать менее 2 символов.')
      .max(50, 'Название подборки не может содержать более 50 символов.'),
  ),
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

type EditCompilationProps = {
  readonly id: number;
  readonly lang: string;
  readonly state: boolean;
  readonly onClose: () => void;
};

export const EditCompilation = ({
  id,
  lang,
  onClose,
}: EditCompilationProps) => {
  const compilationId = id;
  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File>();
  const [compilation, setCompilation] = useState<GetCompilation>();
  const { t } = useTranslation(lang, 'compilations');

  const zodForm = useForm<z.infer<typeof EditCompilationScheme>>({
    resolver: zodResolver(EditCompilationScheme),
    defaultValues: {
      image: undefined,
      title: '',
      description: '',
    },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const compilationData = await getCompilationById(compilationId);
        setCompilation(compilationData);

        zodForm.reset({
          title: compilationData.title,
          description: compilationData.description,
          image: undefined,
        });
      } catch (error) {
        devConsoleError('Error fetching data: ' + error);
      }
    }

    fetchData();
  }, [compilationId, zodForm]);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setCompilation((prev) =>
        prev ? { ...prev, imageUrl: URL.createObjectURL(file) } : prev,
      );
    }
  };

  const onSubmit: SubmitHandler<z.infer<typeof EditCompilationScheme>> = (
    formData,
  ) => {
    const requestData = { ...formData, image: imageFile };
    devConsoleError(requestData);
    updateCompilation(compilationId, requestData);
    handleClose();
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
          {t('updateCompilation')}
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
              <Badge
                overlap='circular'
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <IconButton component='label' color='inherit' sx={{ p: 0 }}>
                    <ModeEditOutlineOutlined color='primary' />
                    <VisuallyHiddenInput
                      id='avatar'
                      name='avatar'
                      type='file'
                      onChange={handleFileChange}
                    />
                  </IconButton>
                }
              >
                <AvatarImage
                  alt={compilation?.title}
                  variant='rounded'
                  src={compilation?.imageUrl}
                  size={112}
                />
              </Badge>
              <FormInput name='title' label={t('name')} variant='standard' />
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
