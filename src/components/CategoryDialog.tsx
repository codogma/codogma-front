import { zodResolver } from '@hookform/resolvers/zod';
import { ModeEditOutlineOutlined } from '@mui/icons-material';
import {
  Badge,
  Box,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { Swatch } from '@vibrant/color';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Vibrant } from 'node-vibrant/browser';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Controller,
  ControllerFieldState,
  FormProvider,
  SubmitHandler,
  useForm,
  useWatch,
} from 'react-hook-form';
import { z } from 'zod';

import { AvatarImage } from '@/components/AvatarImage';
import { CustomDialog } from '@/components/CustomDialog';
import FormInput from '@/components/FormInput';
import { languageMenuItems } from '@/constants/i18n';
import { CreateCategory, createCategory } from '@/helpers/categoryApi';
import { devConsoleWarn } from '@/helpers/devConsoleLogs';
import { Language, PaletteDTO, SwatchDTO } from '@/types';

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

type CategoryDialogProps = {
  readonly lang: Language;
  readonly open: boolean;
  readonly onClose: () => void;
};

export const CategoryDialog = ({
  lang,
  open,
  onClose,
}: CategoryDialogProps) => {
  const [iconUrl, setIconUrl] = useState<string>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [palette, setPalette] = useState<PaletteDTO>();
  const [selectedLang, setSelectedLang] = useState<Language>(lang);
  const t = useTranslations('categoriesPage');
  const router = useRouter();

  const CategoryDialogScheme = z.object({
    name: z.record(
      z.nativeEnum(Language),
      z
        .string()
        .min(2, t('minText', { lang: t(selectedLang), length: 2 }))
        .max(50, t('maxText', { lang: t(selectedLang), length: 50 })),
    ),
    icon: z.instanceof(File, {
      message: t('iconMessage'),
    }),
    image: z.instanceof(File, {
      message: t('imageMessage'),
    }),
    description: z.optional(z.record(z.nativeEnum(Language), z.string())),
  });

  const zodForm = useForm<z.infer<typeof CategoryDialogScheme>>({
    resolver: zodResolver(CategoryDialogScheme),
    defaultValues: {
      name: {
        en: '',
        ru: '',
      },
      icon: undefined,
      image: undefined,
      description: {
        en: '',
        ru: '',
      },
    },
  });

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
    if (isSubmitSuccessful || !open) {
      reset({
        name: {
          en: '',
          ru: '',
        },
        icon: undefined,
        image: undefined,
        description: {
          en: '',
          ru: '',
        },
      });
      setIconUrl(undefined);
      setImageUrl(undefined);
      setPalette(undefined);
      setSelectedLang(lang);
    }
  }, [isSubmitSuccessful, lang, open, reset, zodForm]);

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
            devConsoleWarn('Palette extraction failed:', error);
          })
          .finally(() => {
            URL.revokeObjectURL(fileURL);
          });
      }
    },
    [convertSwatchToDTO, setValue, trigger],
  );

  const onSubmit: SubmitHandler<z.infer<typeof CategoryDialogScheme>> = async (
    formData,
  ) => {
    const requestData = {
      name: formData.name,
      icon: formData.icon,
      image: formData.image,
      description: formData.description,
    };
    const formDataToSend = new FormData();
    formDataToSend.append('name', JSON.stringify(requestData.name));
    if (requestData.icon) formDataToSend.append('icon', requestData.icon);
    if (requestData.image) formDataToSend.append('image', requestData.image);
    if (palette) {
      formDataToSend.append('palette', JSON.stringify(palette));
    }
    if (requestData.description) {
      formDataToSend.append(
        'description',
        JSON.stringify(requestData.description),
      );
    }
    const formDataObject = Object.fromEntries(
      formDataToSend.entries(),
    ) as unknown as CreateCategory;
    createCategory(formDataObject).then((category) => {
      onClose();
      router.push(`/${lang}/categories/${category.id}`);
    });
  };

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      dividers
      title={t('createCategory')}
      actions={
        <Button form='category-form' type='submit'>
          {t('create')}
        </Button>
      }
    >
      <FormProvider {...zodForm}>
        <Box
          noValidate
          id='category-form'
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
            <Typography>{t('selectImage')}</Typography>
            <Controller
              name='image'
              control={control}
              render={({ fieldState }) => (
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
                  <FormHelperText id='image-text' error={!!fieldState.error}>
                    {fieldState.error?.message}
                  </FormHelperText>
                </span>
              )}
            />
          </FormControl>
          {!!palette && (
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
            <Typography>{t('selectIcon')}</Typography>
            <Controller
              name='icon'
              control={control}
              render={({
                fieldState,
              }: {
                readonly fieldState: ControllerFieldState;
              }) => (
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
                  <FormHelperText id='icon-text' error={!!fieldState.error}>
                    {fieldState.error?.message}
                  </FormHelperText>
                </span>
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
            helperText={errors.name?.[selectedLang]?.message}
          />
          <FormInput
            key={`description-${selectedLang}`}
            name={`description.${selectedLang}`}
            label={t('description')}
            variant='standard'
            value={descriptionValues}
          />
        </Box>
      </FormProvider>
    </CustomDialog>
  );
};
