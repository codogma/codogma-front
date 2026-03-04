'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  IconButton,
  MenuItem,
  TextField,
} from '@mui/material';
import Cookies from 'js-cookie';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, {
  DetailedHTMLProps,
  LiHTMLAttributes,
  useEffect,
  useState,
} from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { z } from 'zod';

import { CustomDialog } from '@/components/CustomDialog';
import { NavTooltip } from '@/components/NavTooltip';
import { contlCookie, intlCookie, languageMenuItems } from '@/constants/i18n';
import { getQueryClient } from '@/lib/react-query';
import { Language } from '@/types';

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />;
const checkedIcon = <CheckBoxIcon fontSize='small' />;

type LocalizationDialogProps = {
  readonly lang: Language;
};

const LocalizationDialogScheme = z.object({
  language: z.string(),
  checkedLanguages: z.array(z.string()).min(1, 'Выберите хотя бы один язык.'),
});

export const LocalizationDialog = ({ lang }: LocalizationDialogProps) => {
  const queryClient = getQueryClient();
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const contlCookieVal = Cookies.get(contlCookie);

  const defaultCheckedLanguages: string[] = contlCookieVal
    ? contlCookieVal.split(',')
    : [Language.RU, Language.EN];

  if (!contlCookieVal) {
    Cookies.set(contlCookie, defaultCheckedLanguages.join(','));
  }

  const zodForm = useForm<z.infer<typeof LocalizationDialogScheme>>({
    resolver: zodResolver(LocalizationDialogScheme),
    defaultValues: {
      language: lang,
      checkedLanguages: defaultCheckedLanguages,
    },
  });

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitSuccessful, errors },
  } = zodForm;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(zodForm.getValues());
    }
  }, [isSubmitSuccessful, reset, errors, zodForm, queryClient]);

  const onSubmit: SubmitHandler<
    z.infer<typeof LocalizationDialogScheme>
  > = async (formData) => {
    const { language, checkedLanguages } = formData;
    Cookies.set(intlCookie, language);
    Cookies.set(contlCookie, checkedLanguages.join(','));
    window.dispatchEvent(new Event(contlCookie));
    const newPath = pathname.replace(/\/(en|ru)/, `/${language}`);
    router.push(newPath);
    handleClose();
    await queryClient.invalidateQueries({
      queryKey: ['recentlyArticles'],
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
      <NavTooltip title={t('language')} arrow>
        <IconButton
          color='inherit'
          onClick={handleClickOpen}
          sx={{
            borderRadius: '10px',
            p: 0.75,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transform: 'scale(1.1)',
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
          }}
        >
          <LanguageIcon
            sx={{
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </IconButton>
      </NavTooltip>
      <CustomDialog
        open={open}
        onClose={handleClose}
        dividers
        title={t('languageSettings')}
      >
        <FormProvider {...zodForm}>
          <Box
            noValidate
            component='form'
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
              width: 'fit-content',
              gap: 2,
            }}
          >
            <FormControl sx={{ minWidth: 240 }}>
              <Controller
                name='language'
                control={control}
                render={({ field }) => (
                  <TextField
                    id='language-textfield'
                    select
                    label={t('interfaceLanguage')}
                    value={field.value}
                    onChange={field.onChange}
                    error={Boolean(errors.language?.message)}
                    helperText={errors.language?.message}
                  >
                    {languageMenuItems.map(({ value, label }) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </FormControl>
            <Controller
              name='checkedLanguages'
              control={control}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  id='checkedLanguages-autocomplete'
                  options={languageMenuItems}
                  disableCloseOnSelect
                  value={field.value.map(
                    (val) =>
                      languageMenuItems.find((item) => item.value === val) || {
                        value: val,
                        label: val,
                      },
                  )}
                  onChange={(_, value) =>
                    field.onChange(value.map((v) => v.value))
                  }
                  getOptionLabel={(option) => option.label}
                  renderOption={(
                    props: DetailedHTMLProps<
                      LiHTMLAttributes<HTMLLIElement>,
                      HTMLLIElement
                    >,
                    option,
                    { selected },
                  ) => {
                    const { key, ...optionProps } = props;
                    return (
                      <li key={key} {...optionProps}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.label}
                      </li>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id='checkedLanguages-textfield'
                      label={t('contentLanguages')}
                      error={Boolean(errors.checkedLanguages?.message)}
                      helperText={errors.checkedLanguages?.message}
                      placeholder={t('selectLanguages')}
                    />
                  )}
                />
              )}
            />
            <Button type='submit'>{t('saveChangesBtn')}</Button>
          </Box>
        </FormProvider>
      </CustomDialog>
    </>
  );
};
