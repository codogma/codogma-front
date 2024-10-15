'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  Close as CloseIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Cookies from 'js-cookie';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { z } from 'zod';

import { useTranslation } from '@/app/i18n/client';
import { contlCookie, intlCookie, languageMenuItems } from '@/constants/i18n';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />;
const checkedIcon = <CheckBoxIcon fontSize='small' />;

type LocalizationDialogProps = {
  readonly lang: string;
};

const LocalizationDialogScheme = z.object({
  language: z.string(),
  checkedLanguages: z.array(z.string()).min(1, 'Выберите хотя бы один язык.'),
});

export const LocalizationDialog = ({ lang }: LocalizationDialogProps) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation(lang);
  const pathname = usePathname();
  const router = useRouter();
  const contlCookieVal = Cookies.get(contlCookie);

  const defaultCheckedLanguages: string[] = contlCookieVal
    ? contlCookieVal.split(',')
    : [lang];

  if (!contlCookieVal) {
    Cookies.set(contlCookie, lang);
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
  }, [isSubmitSuccessful, reset, errors, zodForm]);

  const onSubmit: SubmitHandler<z.infer<typeof LocalizationDialogScheme>> = (
    formData,
  ) => {
    const { language, checkedLanguages } = formData;
    Cookies.set(intlCookie, language);
    Cookies.set(contlCookie, checkedLanguages.join(','));
    window.dispatchEvent(new Event(contlCookie));
    const newPath = pathname.replace(/\/(en|ru)/, `/${language}`);
    router.push(newPath);
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
      <Tooltip title={t('language')}>
        <IconButton color='inherit' onClick={handleClickOpen}>
          <LanguageIcon />
        </IconButton>
      </Tooltip>
      <BootstrapDialog aria-labelledby='customized-dialog-title' open={open}>
        <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
          {t('languageSettings')}
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
                      label='Interface language'
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
                        languageMenuItems.find(
                          (item) => item.value === val,
                        ) || { value: val, label: val },
                    )}
                    onChange={(_, value) =>
                      field.onChange(value.map((v) => v.value))
                    }
                    getOptionLabel={(option) => option.label}
                    renderOption={(props, option, { selected }) => {
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
                        label='Content languages'
                        error={Boolean(errors.checkedLanguages?.message)}
                        helperText={errors.checkedLanguages?.message}
                        placeholder='Select languages'
                      />
                    )}
                  />
                )}
              />
              <Button type='submit'>Save changes</Button>
            </Box>
          </FormProvider>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
};
