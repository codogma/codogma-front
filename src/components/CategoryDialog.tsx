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
  TextField,
} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useTranslation } from '@/app/i18n/client';
import { AvatarImage } from '@/components/AvatarImage';
import FormInput from '@/components/FormInput';
import { languageMenuItems } from '@/constants/i18n';
import { CategoryCreate, createCategory } from '@/helpers/categoryApi';
import { devConsoleInfo } from '@/helpers/devConsoleLogs';
import { Language } from '@/types';

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
  readonly open: boolean;
  readonly onClose: () => void;
};

const CategoryDialogScheme = z.object({
  name: z.map(
    z.nativeEnum(Language),
    z
      .string()
      .min(2, 'Название категории не может содержать менее 2 символов.')
      .max(50, 'Название категории не может содержать более 50 символов.'),
  ),
  image: z.instanceof(File, {
    message: 'Изображение обязательно для загрузки.',
  }),
  description: z.optional(z.map(z.nativeEnum(Language), z.string())),
});

export const CategoryDialog = ({
  lang,
  open,
  onClose,
}: CategoryDialogProps) => {
  const [selectedLang, setSelectedLang] = useState<Language>(Language.EN);
  const [imageFile, setImageFile] = useState<File>();
  const [imageUrl, setImageUrl] = useState<string>();
  const { t } = useTranslation(lang, 'categories');
  const [nameMap, setNameMap] = useState<Map<Language, string>>(new Map());
  const [descriptionMap, setDescriptionMap] = useState<Map<Language, string>>(
    new Map(),
  );

  const zodForm = useForm<z.infer<typeof CategoryDialogScheme>>({
    resolver: zodResolver(CategoryDialogScheme),
    defaultValues: {
      name: new Map(),
      image: undefined,
      description: new Map(),
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

  const handleInputChange = (field: 'name' | 'description', value: string) => {
    if (field === 'name') {
      setNameMap((prev) => new Map(prev.set(selectedLang, value)));
    } else if (field === 'description') {
      setDescriptionMap((prev) => new Map(prev.set(selectedLang, value)));
    }
  };

  useEffect(() => {
    setValue('name', nameMap);
    setValue('description', descriptionMap);
  }, [selectedLang, nameMap, descriptionMap, setValue]);

  const onSubmit: SubmitHandler<z.infer<typeof CategoryDialogScheme>> = async (
    formData,
  ) => {
    const requestData = {
      name: nameMap,
      image: imageFile,
      description: descriptionMap,
    };

    const formDataToSend = new FormData();
    formDataToSend.append('name', JSON.stringify(requestData.name));
    if (requestData.image) formDataToSend.append('image', requestData.image);
    if (requestData.description) {
      formDataToSend.append(
        'description',
        JSON.stringify(requestData.description),
      );
    }
    const formDataObject = Object.fromEntries(
      formDataToSend.entries(),
    ) as unknown as CategoryCreate;
    devConsoleInfo(formDataObject);
    await createCategory(formDataObject);
    onClose();
  };

  return (
    <BootstrapDialog aria-labelledby='customized-dialog-title' open={open}>
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
              name={`name.${selectedLang}`}
              required
              label={t('name')}
              variant='standard'
              onChange={(e) => handleInputChange('name', e.target.value)}
              value={nameMap.get(selectedLang) || ''}
            />
            <FormInput
              name={`description.${selectedLang}`}
              label={t('description')}
              variant='standard'
              onChange={(e) => handleInputChange('description', e.target.value)}
              value={descriptionMap.get(selectedLang) || ''}
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
