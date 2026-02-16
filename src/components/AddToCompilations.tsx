'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import { Autocomplete, Box, Button, Chip, TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { z } from 'zod';

import { addToCompilations } from '@/helpers/articleApi';
import {
  getCompilations,
  getCompilationsByTitle,
  GetCompilationsDTO,
} from '@/helpers/compilationApi';
import { GetCompilation } from '@/types';

import { CustomDialog } from './CustomDialog';

interface AddToCompilationsProps {
  readonly id: number;
  readonly username?: string;
  readonly compilations: GetCompilation[];
  readonly onClose?: () => void;
}

interface BookmarkFormData {
  compilationIds: number[];
}

const BookmarkScheme = z.object({
  compilationIds: z.array(z.number()),
});

export const AddToCompilations: React.FC<AddToCompilationsProps> = ({
  id,
  username,
  compilations,
  onClose,
}) => {
  const [open, setOpen] = useState(false);
  const [availableCompilations, setAvailableCompilations] = useState<
    GetCompilation[]
  >([]);
  const [selectedCompilations, setSelectedCompilations] =
    useState<GetCompilation[]>(compilations);
  const [inputCompilationValue, setInputCompilationValue] =
    useState<string>('');
  const [isCompilated, setIsCompilated] = useState(compilations.length > 0);
  const t = useTranslations('compilationsPage');

  const zodForm = useForm<BookmarkFormData>({
    resolver: zodResolver(BookmarkScheme),
    defaultValues: {
      compilationIds: [],
    },
  });

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitSuccessful, errors },
  } = zodForm;

  const { data: compilationsData } = useQuery<GetCompilationsDTO>({
    queryKey: ['compilations', username],
    queryFn: () => getCompilations(undefined, undefined, username),
    enabled: !!username,
  });

  const compilationsPages: GetCompilationsDTO =
    compilationsData as GetCompilationsDTO;

  const { data: compilationsObjects } = useQuery<GetCompilation[]>({
    queryKey: ['compilations', inputCompilationValue],
    queryFn: () => getCompilationsByTitle(inputCompilationValue),
    enabled: !!inputCompilationValue,
    placeholderData: keepPreviousData,
  });

  const filteredUserCompilations = useMemo(() => {
    if (!username) return [];
    return selectedCompilations.filter(
      (compilation) => compilation.ownerName === username,
    );
  }, [selectedCompilations, username]);

  useEffect(() => {
    const mergedCompilations = [
      ...(compilationsObjects || []),
      ...(filteredUserCompilations || []),
      ...(compilationsPages?.content || []),
    ];
    const uniqueCompilations = Array.from(
      mergedCompilations
        .reduce((acc, compilation) => {
          acc.set(compilation.id, compilation);
          return acc;
        }, new Map<number, GetCompilation>())
        .values(),
    );
    setAvailableCompilations(uniqueCompilations);
  }, [compilationsObjects, compilationsPages, filteredUserCompilations]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(zodForm.getValues());
    }
  }, [isSubmitSuccessful, reset, zodForm]);

  const onSubmit: SubmitHandler<z.infer<typeof BookmarkScheme>> = (
    formData,
  ) => {
    const requestData = { ...formData };
    const compilationsIds: number[] = requestData.compilationIds;
    addToCompilations(id, requestData.compilationIds).then(() => {
      setIsCompilated(compilationsIds.length > 0);
      handleClose();
    });
  };

  const handleClickOpen = () => {
    if (onClose) {
      onClose();
    }
    reset({
      compilationIds: selectedCompilations.map((compilation) => compilation.id),
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <MenuItem onClick={handleClickOpen} disableRipple>
        <Typography textAlign='center'>
          {isCompilated ? <PlaylistAddCheckIcon /> : <PlaylistAddIcon />}
          {t('addToCompilation')}
        </Typography>
      </MenuItem>
      <CustomDialog
        open={open}
        onClose={handleClose}
        dividers
        title={t('addToCompilation')}
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
              minWidth: 420,
              width: 'fit-content',
              gap: 2,
            }}
          >
            <Controller
              name='compilationIds'
              control={control}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  id='compilationIds'
                  options={availableCompilations}
                  getOptionLabel={(compilation) => compilation?.title}
                  disableCloseOnSelect
                  defaultValue={availableCompilations.filter((compilation) =>
                    field.value?.includes(compilation.id),
                  )}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  onChange={(_, newValue) => {
                    const normalizedValue: GetCompilation[] = (
                      newValue as GetCompilation[]
                    ).map((value) => {
                      const existingCompilation = availableCompilations.find(
                        (compilation) => compilation.id === value.id,
                      );
                      return existingCompilation || value;
                    });
                    const uniqueCompilationIds = new Set<number>();
                    const uniqueSelectedCompilations =
                      new Set<GetCompilation>();
                    normalizedValue.forEach((compilation) => {
                      uniqueCompilationIds.add(compilation.id);
                      uniqueSelectedCompilations.add(compilation);
                    });
                    const arraySelectedCompilations = Array.from(
                      uniqueSelectedCompilations,
                    );
                    setSelectedCompilations(arraySelectedCompilations);
                    field.onChange(Array.from(uniqueCompilationIds));
                  }}
                  onInputChange={(_, newInputValue) => {
                    setInputCompilationValue(newInputValue);
                  }}
                  renderTags={(value: GetCompilation[], getTagProps) =>
                    value.map((option: GetCompilation, index: number) => {
                      const { key, ...tagProps } = getTagProps({ index });
                      return (
                        <Chip
                          {...tagProps}
                          variant='outlined'
                          label={option.title}
                          key={key}
                        />
                      );
                    })
                  }
                  inputValue={inputCompilationValue}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('compilations')}
                      variant='standard'
                      placeholder={t('selectCompilations')}
                      error={Boolean(errors.compilationIds?.message)}
                      helperText={errors.compilationIds?.message}
                    />
                  )}
                />
              )}
            />
            <Button type='submit'>{t('save')}</Button>
          </Box>
        </FormProvider>
      </CustomDialog>
    </>
  );
};
