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
  Divider,
  IconButton,
  TextField,
} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { Swatch } from '@vibrant/color';
import { useTranslations } from 'next-intl';
import { Vibrant } from 'node-vibrant/browser';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
  useWatch,
} from 'react-hook-form';
import { z } from 'zod';

import { AvatarImage } from '@/components/AvatarImage';
import FormInput from '@/components/FormInput';
import { languageMenuItems } from '@/constants/i18n';
import {
  getCategoryByIdToUpdate,
  UpdateCategory,
  updateCategory,
} from '@/helpers/categoryApi';
import { devConsoleError, devConsoleInfo } from '@/helpers/devConsoleLogs';
import { GetCategoryToUpdate, Language, PaletteDTO, SwatchDTO } from '@/types';

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
  const [iconUrl, setIconUrl] = useState<string>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [open, setOpen] = useState(false);
  const [palette, setPalette] = useState<PaletteDTO>();
  const [selectedLang, setSelectedLang] = useState<Language>(lang);
  const t = useTranslations('categoriesPage');

  const EditCategoryScheme = z.object({
    name: z.optional(
      z.record(
        z.nativeEnum(Language),
        z.string().min(2, t('minText')).max(50, t('maxText')),
      ),
    ),
    icon: z.optional(z.instanceof(File)),
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
      icon: undefined,
      image: undefined,
      description: categoryData?.description,
    },
  });

  useEffect(() => {
    zodForm.reset({
      name: categoryData?.name,
      icon: undefined,
      image: undefined,
      description: categoryData?.description,
    });
    setIconUrl(categoryData?.icon?.imageUrl);
    setImageUrl(categoryData?.image?.imageUrl);
    setPalette(categoryData?.image?.palette);
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
  }) as Record<Language, string>;

  const descriptionValues = useWatch({
    name: `description.${selectedLang}`,
    control,
  }) as Record<Language, string>;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(zodForm.getValues());
    }
  }, [isSubmitSuccessful, reset, zodForm]);

  const handleIconChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setIconUrl(fileURL);
      setValue('icon', file);
      trigger('icon');
    }
  };

  const convertSwatchToDTO = useCallback(
    (swatch: Swatch | null): SwatchDTO | undefined => {
      if (!swatch) return undefined;
      return {
        r: swatch.r,
        g: swatch.g,
        b: swatch.b,
        population: swatch.population,
        h: swatch.hsl[0],
        s: swatch.hsl[1],
        l: swatch.hsl[2],
        hex: swatch.hex,
        titleTextColor: swatch.titleTextColor,
        bodyTextColor: swatch.bodyTextColor,
      };
    },
    [],
  );

  const handleImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const fileURL = URL.createObjectURL(file);
        setImageUrl(fileURL);
        Vibrant.from(fileURL)
          .getPalette()
          .then((paletteResult) => {
            const paletteData = {
              vibrant: convertSwatchToDTO(paletteResult.Vibrant),
              muted: convertSwatchToDTO(paletteResult.Muted),
              darkVibrant: convertSwatchToDTO(paletteResult.DarkVibrant),
              darkMuted: convertSwatchToDTO(paletteResult.DarkMuted),
              lightVibrant: convertSwatchToDTO(paletteResult.LightVibrant),
              lightMuted: convertSwatchToDTO(paletteResult.LightMuted),
            };
            setPalette(paletteData);
            setValue('image', file);
            trigger('image');
          })
          .catch((error) => {
            devConsoleError('Palette extraction failed:', error);
          })
          .finally(() => {
            URL.revokeObjectURL(fileURL);
          });
      }
    },
    [convertSwatchToDTO, setValue, trigger],
  );

  const onSubmit: SubmitHandler<z.infer<typeof EditCategoryScheme>> = (
    formData,
  ) => {
    const formDataToSend = new FormData();
    formDataToSend.append('name', JSON.stringify(formData.name));
    if (formData.icon) formDataToSend.append('icon', formData.icon);
    if (formData.image) formDataToSend.append('image', formData.image);
    if (palette) {
      formDataToSend.append('palette', JSON.stringify(palette));
    }
    if (formData.description) {
      formDataToSend.append(
        'description',
        JSON.stringify(formData.description),
      );
    }
    const formDataObject = Object.fromEntries(
      formDataToSend.entries(),
    ) as unknown as UpdateCategory;
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
              <FormControl sx={{ mb: 1 }}>
                <Controller
                  name='image'
                  control={control}
                  render={() => (
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
                            onChange={handleImageChange}
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
                  )}
                />
              </FormControl>
              {palette && (
                <Stack
                  key={JSON.stringify(palette)}
                  direction='row'
                  divider={<Divider orientation='vertical' flexItem />}
                  spacing={2}
                  sx={{ flexWrap: 'wrap' }}
                >
                  {palette.vibrant && (
                    <Paper sx={{ backgroundColor: palette.vibrant.hex }}>
                      <Typography color={palette.vibrant?.titleTextColor}>
                        Vibrant
                      </Typography>
                    </Paper>
                  )}
                  {palette.darkVibrant && (
                    <Paper sx={{ backgroundColor: palette.darkVibrant.hex }}>
                      <Typography color={palette.darkVibrant?.titleTextColor}>
                        Dark Vibrant
                      </Typography>
                    </Paper>
                  )}
                  {palette.lightVibrant && (
                    <Paper sx={{ backgroundColor: palette.lightVibrant.hex }}>
                      <Typography color={palette.lightVibrant?.titleTextColor}>
                        Light Vibrant
                      </Typography>
                    </Paper>
                  )}
                  {palette.muted && (
                    <Paper sx={{ backgroundColor: palette.muted.hex }}>
                      <Typography color={palette.muted?.titleTextColor}>
                        Muted
                      </Typography>
                    </Paper>
                  )}
                  {palette.darkMuted && (
                    <Paper sx={{ backgroundColor: palette.darkMuted.hex }}>
                      <Typography color={palette.darkMuted?.titleTextColor}>
                        Dark Muted
                      </Typography>
                    </Paper>
                  )}
                  {palette.lightMuted && (
                    <Paper sx={{ backgroundColor: palette.lightMuted.hex }}>
                      <Typography color={palette.lightMuted?.titleTextColor}>
                        Light Muted
                      </Typography>
                    </Paper>
                  )}
                </Stack>
              )}
              <FormControl sx={{ mb: 1 }}>
                <Controller
                  name='icon'
                  control={control}
                  render={() => (
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
                            id='icon'
                            name='icon'
                            type='file'
                            onChange={handleIconChange}
                          />
                        </IconButton>
                      }
                    >
                      <AvatarImage
                        type='image'
                        variant='rounded'
                        src={iconUrl}
                        size={112}
                        fontSize='large'
                      />
                    </Badge>
                  )}
                />
              </FormControl>
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
