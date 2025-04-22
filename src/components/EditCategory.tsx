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
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useWatch,
} from 'react-hook-form';
import { z } from 'zod';

import { useTranslation } from '@/app/i18n/client';
import { AvatarImage } from '@/components/AvatarImage';
import FormInput from '@/components/FormInput';
import { languageMenuItems } from '@/constants/i18n';
import {
  CategoryUpdate,
  getCategoryByIdToUpdate,
  updateCategory,
} from '@/helpers/categoryApi';
import { devConsoleInfo } from '@/helpers/devConsoleLogs';
import { GetCategoryToUpdate, Language } from '@/types';

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
  readonly lang: Language;
  readonly refetch?: () => void;
  readonly onClose?: () => void;
};

export const EditCategory = ({
  id,
  lang,
  refetch,
  onClose,
}: EditCategoryProps) => {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [selectedLang, setSelectedLang] = useState<Language>(lang);
  const { t } = useTranslation(lang, 'categories');

  const EditCategoryScheme = z.object({
    name: z.record(
      z.nativeEnum(Language),
      z.string().min(2, t('minText')).max(50, t('maxText')),
    ),
    image: z.optional(z.instanceof(File)),
    description: z.optional(z.record(z.nativeEnum(Language), z.string())),
  });

  const { data: categoryData, refetch: refetchCategoryData } =
    useQuery<GetCategoryToUpdate>({
      queryKey: ['category', id],
      queryFn: () => getCategoryByIdToUpdate(id),
      enabled: false,
    });

  const zodForm = useForm<z.infer<typeof EditCategoryScheme>>({
    resolver: zodResolver(EditCategoryScheme),
    defaultValues: {
      name: categoryData?.name,
      image: undefined,
      description: categoryData?.description,
    },
  });

  useEffect(() => {
    zodForm.reset({
      name: categoryData?.name,
      image: undefined,
      description: categoryData?.description,
    });
    setImageUrl(categoryData?.imageUrl);
  }, [categoryData, zodForm]);

  const {
    reset,
    handleSubmit,
    setValue,
    trigger,
    control,
    formState: { isSubmitSuccessful, errors },
  } = zodForm;

  const nameValues = useWatch({
    name: `name.${selectedLang}`,
    control,
  }) as Record<string, string>;

  const descriptionValues = useWatch({
    name: `description.${selectedLang}`,
    control,
  }) as Record<string, string>;

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

  const onSubmit: SubmitHandler<z.infer<typeof EditCategoryScheme>> = (
    formData,
  ) => {
    const requestData = {
      name: formData.name,
      image: formData.image,
      description: formData.description,
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
    ) as unknown as CategoryUpdate;
    devConsoleInfo(formDataObject);
    updateCategory(id, formDataObject).then(() => {
      if (refetch) {
        refetch();
      }
      handleClose();
    });
  };

  const handleClickOpen = () => {
    refetchCategoryData().then(() => {
      if (onClose) {
        onClose();
      }
      setOpen(true);
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <MenuItem onClick={handleClickOpen} disableRipple>
        <Typography textAlign='center'>{t('edit')}</Typography>
      </MenuItem>
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
                    alt={categoryData?.name?.[selectedLang]}
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
                key={`name-${selectedLang}`}
                name={`name.${selectedLang}`}
                required
                label={t('name')}
                variant='standard'
                value={nameValues}
                error={!!errors.name?.ru || !!errors.name?.en}
                helperText={
                  (!!errors.name?.[selectedLang] &&
                    errors.name?.[selectedLang].message?.replace(
                      '{}',
                      t(selectedLang.toLowerCase()),
                    )) ||
                  (!!errors.name?.ru &&
                    errors.name?.ru?.message?.replace('{}', t('ru'))) ||
                  (!!errors.name?.en &&
                    errors.name?.en?.message?.replace('{}', t('en')))
                }
              />
              <FormInput
                key={`description-${selectedLang}`}
                name={`description.${selectedLang}`}
                label={t('description')}
                variant='standard'
                value={descriptionValues}
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
