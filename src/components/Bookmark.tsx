'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Close as CloseIcon } from '@mui/icons-material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import { styled } from '@mui/material/styles';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { z } from 'zod';

import { useTranslation } from '@/app/i18n/client';
import {
  getCompilations,
  getCompilationsByTitle,
  GetCompilationsDTO,
} from '@/helpers/compilationApi';
import { devConsoleError } from '@/helpers/devConsoleLogs';
import { GetCompilation } from '@/types';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

interface BookmarkProps {
  readonly username?: string;
  readonly lang: string;
  readonly id: number;
  readonly isBookmarkedValue?: boolean;
}

const BookmarkScheme = z.object({
  compilationIds: z.array(z.number()).min(1, 'Выберите хотя бы одну подборку.'),
});

export const Bookmark: React.FC<BookmarkProps> = ({
  username,
  id,
  lang,
  isBookmarkedValue,
}) => {
  // const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
  //   null,
  // );
  // const [isBookmarked, setIsBookmarked] = useState(isBookmarkedValue);
  const SELECTED_COMPILATIONS = 'selected-compilations';
  const [open, setOpen] = useState(false);
  const [availableCompilations, setAvailableCompilations] = useState<
    GetCompilation[]
  >([]);
  const [selectedCompilations, setSelectedCompilations] =
    useState<GetCompilation[]>();
  const [inputCompilationValue, setInputCompilationValue] =
    useState<string>('');
  // const { state } = useAuth();
  const { t } = useTranslation(lang, 'articles');
  // const popoverId = 'simple-popover';

  const zodForm = useForm<z.infer<typeof BookmarkScheme>>({
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
    queryKey: ['compilations'],
    queryFn: () => getCompilations(),
  });

  const compilationsPages: GetCompilationsDTO =
    compilationsData as GetCompilationsDTO;

  const { data: compilationsObjects } = useQuery<GetCompilation[]>({
    queryKey: ['compilations', inputCompilationValue],
    queryFn: () => getCompilationsByTitle(inputCompilationValue),
    enabled: !!inputCompilationValue,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (selectedCompilations) {
      localStorage.setItem(
        SELECTED_COMPILATIONS,
        JSON.stringify(selectedCompilations),
      );
    }
  }, [selectedCompilations]);

  useEffect(() => {
    const lsSelectedCompilationsData = localStorage.getItem(
      SELECTED_COMPILATIONS,
    );
    let lsSelectedCompilations: GetCompilation[] = [];
    if (lsSelectedCompilationsData !== null)
      lsSelectedCompilations = JSON.parse(lsSelectedCompilationsData);
    const mergedCompilations = [
      ...(compilationsObjects || []),
      ...(lsSelectedCompilations || []),
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
  }, [compilationsObjects, compilationsPages]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(zodForm.getValues());
    }
  }, [isSubmitSuccessful, reset, zodForm]);

  const onSubmit: SubmitHandler<z.infer<typeof BookmarkScheme>> = (
    formData,
  ) => {
    const requestData = { ...formData };
    devConsoleError(requestData);
    // createCompilation(requestData);
    handleClose();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // const handleUnbookmark = async () => {
  //   if (state.isAuthenticated) {
  //     await unbookmark(id).then((response) =>
  //       setIsBookmarked(response.isBookmarked),
  //     );
  //   }
  // };
  //
  // const handleBookmark = async (event: React.MouseEvent<HTMLButtonElement>) => {
  //   if (state.isAuthenticated) {
  //     await bookmark(id).then((response) =>
  //       setIsBookmarked(response.isBookmarked),
  //     );
  //   } else {
  //     setAnchorEl(event.currentTarget);
  //   }
  // };
  //
  // const handlePopoverClose = () => {
  //   setAnchorEl(null);
  // };

  // return state.user?.username !== username ? (
  //   <>
  //     {isBookmarked ? (
  // <IconButton onClick={handleUnbookmark}>
  // <BookmarkIcon color='error' />
  // ) : (
  // </IconButton>
  // <IconButton onClick={handleBookmark}>
  // <BookmarkIcon aria-describedby={popoverId} />
  // </IconButton>
  // )}
  {
    /*{!state.isAuthenticated && (*/
  }
  {
    /*  <PopoverElement*/
  }
  {
    /*    popoverId={popoverId}*/
  }
  {
    /*    btnEl={anchorEl}*/
  }
  {
    /*    onClose={handlePopoverClose}*/
  }
  {
    /*    destination={t('popoverBookmark')}*/
  }
  {
    /*    lang={lang}*/
  }
  {
    /*  />*/
  }
  {
    /*)}*/
  }
  // </>
  // ) : null;
  // };

  return (
    <>
      <IconButton color='inherit' onClick={handleClickOpen}>
        <BookmarkIcon />
      </IconButton>
      <BootstrapDialog aria-labelledby='customized-dialog-title' open={open}>
        <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
          {t('addToCompilation')}
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
              <Controller
                name='compilationIds'
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    id='compilationIds'
                    options={availableCompilations}
                    getOptionLabel={(compilation) =>
                      (compilation as GetCompilation)?.title
                    }
                    freeSolo
                    value={availableCompilations.filter((compilation) =>
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
                      setSelectedCompilations(
                        Array.from(uniqueSelectedCompilations),
                      );
                      field.onChange(Array.from(uniqueCompilationIds));
                    }}
                    onInputChange={(_, newInputValue) =>
                      setInputCompilationValue(newInputValue)
                    }
                    renderTags={(value: GetCompilation[], getTagProps) =>
                      value.map((option: GetCompilation, index: number) => {
                        const { key, ...tagProps } = getTagProps({ index });
                        return (
                          <Chip
                            variant='outlined'
                            label={option.title}
                            key={key}
                            {...tagProps}
                          />
                        );
                      })
                    }
                    inputValue={inputCompilationValue}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t('searchCompilations')}
                        variant='standard'
                        placeholder={t('selectCompilations')}
                        error={Boolean(errors.compilationIds?.message)}
                        helperText={errors.compilationIds?.message}
                      />
                    )}
                  />
                )}
              />
              <Button type='submit'>{t('createCompilation')}</Button>
            </Box>
          </FormProvider>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
};
