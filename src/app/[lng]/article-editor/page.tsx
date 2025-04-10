'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { CloudDone, ModeEditOutlineOutlined } from '@mui/icons-material';
import {
  Autocomplete,
  Badge,
  Box,
  Button,
  Chip,
  FormHelperText,
  IconButton,
  Step,
  StepIcon,
  StepIconProps,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import { styled, useTheme } from '@mui/material/styles';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { z } from 'zod';

import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import { AvatarImage } from '@/components/AvatarImage';
import FormInput from '@/components/FormInput';
import { LinkWithPopover } from '@/components/LinkWithPopover';
import { TinyMCEEditor } from '@/components/TinyMCEEditor';
import { WithAuth } from '@/components/WithAuth';
import { languageMenuItems } from '@/constants/i18n';
import {
  createDraftArticle,
  CreateDraftArticleDTO,
  deleteArticle,
  getDraftArticles,
  getDraftedArticleById,
  updateArticle,
  UpdateArticleDTO,
  updateDraftArticle,
  UpdateDraftArticleDTO,
} from '@/helpers/articleApi';
import {
  getCategories,
  getCategoriesByName,
  GetCategoriesDTO,
} from '@/helpers/categoryApi';
import {
  getCompilations,
  getCompilationsByTitle,
  GetCompilationsDTO,
} from '@/helpers/compilationApi';
import { devConsoleError } from '@/helpers/devConsoleLogs';
import { uploadImage } from '@/helpers/imageUploadApi';
import { getTagsByName } from '@/helpers/tagApi';
import {
  GetArticle,
  GetCategory,
  GetCompilation,
  GetTag,
  Language,
} from '@/types';

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

type PageParams = {
  readonly params: { lng: Language };
};

type StepType = {
  label: string;
  stepContent: React.ReactNode;
  error?: boolean;
};

const StepOneScheme = z.object({
  title: z
    .string()
    .min(1, 'Название статьи не может быть пустой.')
    .max(300, 'Название статьи не может содержать более 300 символов.'),
  content: z.string().min(1, 'Основная статья не может быть пустой.'),
});

const StepTwoScheme = z.object({
  language: z.nativeEnum(Language),
  originalArticleId: z.number().optional().nullable(),
  imageUrl: z.string().min(1, 'Изображение обязательно для загрузки.'),
  previewContent: z.string().min(1, 'Краткое описание не может быть пустым.'),
  categoryIds: z.array(z.number()).min(1, 'Выберите хотя бы одну категорию.'),
  compilationIds: z.array(z.number()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
});

const CustomStepIcon = (props: StepIconProps) => {
  const { active, icon } = props;
  const theme = useTheme();

  const isLastStep = icon === 3;

  const iconColor = active
    ? theme.palette.success.main
    : theme.palette.grey[500];

  return isLastStep ? (
    <CloudDone style={{ color: iconColor }} />
  ) : (
    <StepIcon {...props} />
  );
};

type StepOneType = Pick<UpdateDraftArticleDTO, 'title' | 'content'> | null;
type StepTwoType = Omit<UpdateDraftArticleDTO, 'title' | 'content'> | null;

const Page = ({ params: { lng } }: PageParams) => {
  const STEP_ONE_DATA = 'step-one-data';
  const STEP_TWO_DATA = 'step-two-data';
  const SELECTED_CATEGORIES = 'selected-categories';
  const SELECTED_COMPILATIONS = 'selected-compilations';
  const ARTICLE_ID = 'article-id';
  const PARAM_ID = 'id';
  const {
    state: { user },
  } = useAuth();
  const username = user?.username;
  const route = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const paramId = searchParams.get(PARAM_ID);
  const [stepOneData, setStepOneData] = useState<StepOneType>(null);
  const [reset, setReset] = useState<boolean>(false);
  const [stepTwoData, setStepTwoData] = useState<StepTwoType>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [articleId, setArticleId] = useState<number>(0);
  const [draftArticles, setDraftArticles] = useState<GetArticle[]>([]);
  const [inputCategoryValue, setInputCategoryValue] = useState<string>('');
  const [inputCompilationValue, setInputCompilationValue] =
    useState<string>('');
  const [inputTagValue, setInputTagValue] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<GetCategory[]>();
  const [selectedCompilations, setSelectedCompilations] =
    useState<GetCompilation[]>();
  const [availableCategories, setAvailableCategories] = useState<GetCategory[]>(
    [],
  );
  const [availableCompilations, setAvailableCompilations] = useState<
    GetCompilation[]
  >([]);
  const [prevData, setPrevData] = useState<UpdateDraftArticleDTO | null>(null);
  const { t } = useTranslation(lng, 'articleEditor');

  const id = useMemo(() => {
    const param = searchParams.get(PARAM_ID);
    return Number(param) || 0;
  }, [searchParams]);

  const zodStepOneForm = useForm<z.infer<typeof StepOneScheme>>({
    resolver: zodResolver(StepOneScheme),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const {
    reset: resetStepOne,
    handleSubmit: handleSubmitStepOne,
    control: controlStepOne,
    formState: {
      isSubmitSuccessful: isSubmitSuccessfulStepOne,
      errors: errorsStepOne,
    },
    watch: watchStepOne,
  } = zodStepOneForm;

  const zodStepTwoForm = useForm<z.infer<typeof StepTwoScheme>>({
    resolver: zodResolver(StepTwoScheme),
    defaultValues: {
      language: lng,
      originalArticleId: null,
      imageUrl: '',
      previewContent: '',
      categoryIds: [],
      compilationIds: [],
      tags: [],
    },
  });

  const {
    reset: resetStepTwo,
    handleSubmit: handleSubmitStepTwo,
    control: controlStepTwo,
    formState: {
      isSubmitSuccessful: isSubmitSuccessfulStepTwo,
      errors: errorsStepTwo,
    },
    setValue,
    trigger,
    watch: watchStepTwo,
  } = zodStepTwoForm;

  const { data: categoriesData } = useQuery<GetCategoriesDTO>({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  });

  const categoriesPages: GetCategoriesDTO = categoriesData as GetCategoriesDTO;

  const { data: compilationsData } = useQuery<GetCompilationsDTO>({
    queryKey: ['compilations', username],
    queryFn: () => getCompilations(undefined, undefined, username),
    enabled: !!username,
  });

  const compilationsPages: GetCompilationsDTO =
    compilationsData as GetCompilationsDTO;

  const { data: draftArticlesData, refetch: refetchDraftArticlesData } =
    useQuery<GetArticle[]>({
      queryKey: ['draftArticles'],
      queryFn: () => getDraftArticles(),
    });

  const isValidId = (validatingId: unknown) => {
    return (
      typeof validatingId === 'number' &&
      validatingId > 0 &&
      Number.isSafeInteger(validatingId)
    );
  };

  const { data: article, isFetched } = useQuery<GetArticle>({
    queryKey: ['article', id],
    queryFn: () => getDraftedArticleById(id),
    enabled: isValidId(id),
  });

  useEffect(() => {
    if (Array.isArray(draftArticlesData)) {
      setDraftArticles(draftArticlesData);
    }
  }, [draftArticlesData]);

  const deleteArticleData = useCallback(() => {
    refetchDraftArticlesData().then(() => {
      setArticleId(0);
      resetStepOne({ title: '', content: '' });
      resetStepTwo({
        language: lng,
        originalArticleId: null,
        imageUrl: '',
        previewContent: '',
        categoryIds: [],
        compilationIds: [],
        tags: [],
      });
      setReset(true);
      setPrevData(null);
      setActiveStep(0);
      setStepOneData(null);
      setStepTwoData(null);
      localStorage.removeItem(STEP_ONE_DATA);
      localStorage.removeItem(STEP_TWO_DATA);
      localStorage.removeItem(SELECTED_CATEGORIES);
      localStorage.removeItem(SELECTED_COMPILATIONS);
      localStorage.removeItem(ARTICLE_ID);
    });
  }, [refetchDraftArticlesData, resetStepOne, resetStepTwo, lng]);

  const handleDeleteArticle = useCallback(
    (id: number) => {
      deleteArticle(id).then(() => {
        refetchDraftArticlesData().then((response) => {
          if (Array.isArray(response.data)) {
            setDraftArticles(response.data);
          }
        });
        if (id === articleId) {
          deleteArticleData();
        }
      });
    },
    [articleId, deleteArticleData, refetchDraftArticlesData],
  );

  const setArticleData = useCallback(
    (articleData: GetArticle) => {
      if (isValidId(articleData.id)) setArticleId(articleData.id);
      localStorage.setItem(ARTICLE_ID, String(articleData.id));
      resetStepOne({
        title: articleData.title,
        content: articleData.content,
      });
      resetStepTwo({
        language: articleData.language || lng,
        originalArticleId: articleData.originalArticleId,
        imageUrl: articleData.imageUrl,
        previewContent: articleData.previewContent,
        categoryIds: articleData.categories.map((category) => category.id),
        compilationIds: articleData.compilations.map(
          (compilation) => compilation.id,
        ),
        tags: articleData.tags.map((tag) => tag.name),
      });
    },
    [resetStepOne, resetStepTwo, lng],
  );

  const handleSelectArticle = useCallback(
    (articleData: GetArticle) => {
      setArticleData(articleData);
    },
    [setArticleData],
  );

  const handleNewArticle = useCallback(() => {
    deleteArticleData();
  }, [deleteArticleData]);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        uploadImage(formData)
          .then((imageUrl) => {
            // resolve(`${process.env.NEXT_PUBLIC_BASE_URL}${imageUrl}`);
            setValue('imageUrl', imageUrl);
            trigger('imageUrl');
          })
          .catch((error) => {
            devConsoleError('Failed to upload image:', error);
          });
      }
    },
    [setValue, trigger],
  );

  useEffect(() => {
    if (article) {
      setArticleData(article);
      setAvailableCategories([
        ...(categoriesPages?.content || []),
        ...article.categories,
      ]);
      setSelectedCategories(article.categories);
      setAvailableCompilations([
        ...(compilationsPages?.content || []),
        ...article.compilations,
      ]);
      setSelectedCompilations(article.compilations);
    } else {
      const lsArticleId = Number(localStorage.getItem(ARTICLE_ID));
      if (isValidId(lsArticleId)) {
        setArticleId(lsArticleId);
      } else {
        setArticleId(0);
      }
    }
    const lsStepOneData = localStorage.getItem(STEP_ONE_DATA);
    if (lsStepOneData) {
      const parsedStepOneData = JSON.parse(lsStepOneData);
      resetStepOne(parsedStepOneData);
    }
    const lsStepTwoData = localStorage.getItem(STEP_TWO_DATA);
    if (lsStepTwoData) {
      const parsedStepTwoData = JSON.parse(lsStepTwoData);
      resetStepTwo(parsedStepTwoData);
    }
    if ((isFetched && paramId) || !isValidId(id)) route.replace(pathname);
  }, [
    article,
    categoriesPages,
    compilationsPages,
    id,
    isFetched,
    paramId,
    pathname,
    resetStepOne,
    resetStepTwo,
    route,
    setArticleData,
  ]);

  const { data: categoriesObjects } = useQuery<GetCategory[]>({
    queryKey: ['categories', inputCategoryValue],
    queryFn: () => getCategoriesByName(inputCategoryValue),
    enabled: !!inputCategoryValue,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (selectedCategories) {
      localStorage.setItem(
        SELECTED_CATEGORIES,
        JSON.stringify(selectedCategories),
      );
    }
  }, [selectedCategories]);

  useEffect(() => {
    const lsSelectedCategoriesData = localStorage.getItem(SELECTED_CATEGORIES);
    let lsSelectedCategories: GetCategory[] = [];
    if (lsSelectedCategoriesData !== null)
      lsSelectedCategories = JSON.parse(lsSelectedCategoriesData);
    const mergedCategories = [
      ...(categoriesObjects || []),
      ...(lsSelectedCategories || []),
      ...(categoriesPages?.content || []),
    ];
    const uniqueCategories = Array.from(
      mergedCategories
        .reduce((acc, category) => {
          acc.set(category.id, category);
          return acc;
        }, new Map<number, GetCategory>())
        .values(),
    );
    setAvailableCategories(uniqueCategories);
  }, [categoriesObjects, categoriesPages]);

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

  const { data: tagObjects } = useQuery<GetTag[]>({
    queryKey: ['tags', inputTagValue],
    queryFn: () => getTagsByName(inputTagValue),
    enabled: !!inputTagValue,
    placeholderData: keepPreviousData,
  });

  const availableTags: string[] = useMemo(
    () => tagObjects?.map((tag) => tag.name) ?? [],
    [tagObjects],
  );

  useEffect(() => {
    devConsoleError(Object.keys(errorsStepOne).length > 0);
    if (isSubmitSuccessfulStepOne) {
      resetStepOne(zodStepOneForm.getValues());
    }
  }, [errorsStepOne, isSubmitSuccessfulStepOne, resetStepOne, zodStepOneForm]);

  useEffect(() => {
    devConsoleError(errorsStepTwo);
    if (isSubmitSuccessfulStepTwo) {
      resetStepTwo(zodStepTwoForm.getValues());
    }
  }, [errorsStepTwo, isSubmitSuccessfulStepTwo, resetStepTwo, zodStepTwoForm]);

  useEffect(() => {
    if (!isSubmitSuccessfulStepTwo) {
      const subscriptionStepOne = watchStepOne((data) => {
        if (data.title) {
          setStepOneData(data as StepOneType);
          localStorage.setItem(STEP_ONE_DATA, JSON.stringify(data));
        }
      });
      const subscriptionStepTwo = watchStepTwo((data) => {
        if (data) {
          setStepTwoData(data as StepTwoType);
          localStorage.setItem(STEP_TWO_DATA, JSON.stringify(data));
        }
      });

      return () => {
        subscriptionStepOne.unsubscribe();
        subscriptionStepTwo.unsubscribe();
      };
    }
  }, [isSubmitSuccessfulStepTwo, watchStepOne, watchStepTwo]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const { mutate: createDraftArticleMutate } = useMutation({
    mutationFn: (requestData: CreateDraftArticleDTO) =>
      createDraftArticle(requestData),
    onSuccess: (data) => {
      refetchDraftArticlesData().then((response) => {
        if (Array.isArray(response.data)) {
          setDraftArticles(response.data);
        }
      });
      const draftArticleId = Number(data?.id);
      if (isValidId(draftArticleId)) setArticleId(draftArticleId);
      if (draftArticleId) {
        localStorage.setItem(ARTICLE_ID, String(draftArticleId));
      }
    },
  });

  const { mutate: updateDraftArticleMutate } = useMutation({
    mutationFn: (requestData: UpdateDraftArticleDTO) =>
      updateDraftArticle(articleId, requestData),
    onSuccess: () => {
      refetchDraftArticlesData().then((response) => {
        if (Array.isArray(response.data)) {
          setDraftArticles(response.data);
        }
      });
    },
  });

  const { mutate: updateArticleMutate } = useMutation({
    mutationFn: (requestData: UpdateArticleDTO) =>
      updateArticle(articleId, requestData),
  });

  useEffect(() => {
    const lsStepOneData = localStorage.getItem(STEP_ONE_DATA);
    let parsedStepOneData: StepOneType = null;
    if (lsStepOneData !== null) {
      parsedStepOneData = JSON.parse(lsStepOneData);
    }
    if (
      parsedStepOneData !== null &&
      stepOneData?.title &&
      !isValidId(articleId)
    ) {
      const timer = setTimeout(() => {
        createDraftArticleMutate(zodStepOneForm.getValues());
      }, 1000);

      return () => clearTimeout(timer);
    }
    if (isValidId(articleId)) {
      const currentData = {
        ...stepOneData,
        ...stepTwoData,
      };
      const timer = setTimeout(() => {
        if (JSON.stringify(currentData) !== JSON.stringify(prevData)) {
          updateDraftArticleMutate(currentData);
          setPrevData(currentData);
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [
    articleId,
    createDraftArticleMutate,
    prevData,
    stepOneData,
    stepTwoData,
    updateDraftArticleMutate,
    zodStepOneForm,
  ]);

  const onStepOneSubmit: SubmitHandler<z.infer<typeof StepOneScheme>> =
    useCallback((formData) => {
      setStepOneData({ ...formData });
      handleNext();
    }, []);

  const onStepTwoSubmit: SubmitHandler<z.infer<typeof StepTwoScheme>> =
    useCallback(
      (formData) => {
        if (stepOneData && formData) {
          const requestData: UpdateArticleDTO = {
            ...stepOneData,
            ...formData,
          } as UpdateArticleDTO;
          updateArticleMutate(requestData);
        }
        handleNext();
        setStepOneData(null);
        setStepTwoData(null);
        setPrevData({});
        localStorage.removeItem(STEP_ONE_DATA);
        localStorage.removeItem(STEP_TWO_DATA);
        localStorage.removeItem(SELECTED_CATEGORIES);
        localStorage.removeItem(SELECTED_COMPILATIONS);
        localStorage.removeItem(ARTICLE_ID);
      },
      [stepOneData, updateArticleMutate],
    );

  const onSubmit = useCallback(() => {
    route.push(`/articles/${articleId}`);
  }, [articleId, route]);

  const steps: StepType[] = useMemo(
    () => [
      {
        label: t('mainContent'),
        stepContent: (
          <FormProvider {...zodStepOneForm}>
            <Box
              component='form'
              noValidate
              autoComplete='off'
              onSubmit={handleSubmitStepOne(onStepOneSubmit)}
            >
              <Box className='align-center mb-1 flex items-center'>
                <FormInput
                  className='w-full flex-1'
                  name='title'
                  label={t('title')}
                  variant='standard'
                />
                {draftArticles.length > 0 && (
                  <LinkWithPopover
                    draftArticles={draftArticles}
                    onDeleteArticle={handleDeleteArticle}
                    onSelectArticle={handleSelectArticle}
                    lang={lng}
                  />
                )}
              </Box>
              <Typography className='my-4'>{t('mainContent')}:</Typography>
              {errorsStepOne.content?.message && (
                <Typography variant='body2' color='error'>
                  {errorsStepOne.content?.message}
                </Typography>
              )}
              <Controller
                name='content'
                control={controlStepOne}
                render={({ field }) => (
                  <TinyMCEEditor id='content' {...field} reset={reset} />
                )}
              />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  pt: 2,
                  justifyContent: 'space-between',
                }}
              >
                <Button onClick={() => handleNewArticle()}>
                  {t('newArticle')}
                </Button>
                <Button type='submit'>{t('proceedToSettings')}</Button>
              </Box>
            </Box>
          </FormProvider>
        ),
        error: Object.keys(errorsStepOne).length > 0,
      },
      {
        label: t('settingsAndPreview'),
        stepContent: (
          <FormProvider {...zodStepTwoForm}>
            <Box
              component='form'
              noValidate
              autoComplete='off'
              onSubmit={handleSubmitStepTwo(onStepTwoSubmit)}
            >
              <FormControl sx={{ mb: 1 }}>
                <Controller
                  name='language'
                  control={controlStepTwo}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label={t('language')}
                      variant='standard'
                      error={Boolean(errorsStepTwo.language?.message)}
                      helperText={errorsStepTwo.language?.message}
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
              <FormControl sx={{ mb: 1 }} className='w-full'>
                <Controller
                  name='categoryIds'
                  control={controlStepTwo}
                  render={({ field }) => (
                    <Autocomplete
                      multiple
                      id='categoryIds'
                      options={availableCategories}
                      getOptionLabel={(category) => category?.name}
                      disableCloseOnSelect
                      defaultValue={availableCategories.filter((category) =>
                        field.value?.includes(category.id),
                      )}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      onChange={(_, newValue) => {
                        const normalizedValue: GetCategory[] = (
                          newValue as GetCategory[]
                        ).map((value) => {
                          const existingCategory = availableCategories.find(
                            (category) => category.id === value.id,
                          );
                          return existingCategory || value;
                        });

                        const uniqueCategoriesIds = new Set<number>();
                        const uniqueSelectedCategories = new Set<GetCategory>();
                        normalizedValue.forEach((category) => {
                          uniqueCategoriesIds.add(category.id);
                          uniqueSelectedCategories.add(category);
                        });
                        const arraySelectedCategories = Array.from(
                          uniqueSelectedCategories,
                        );
                        setSelectedCategories(arraySelectedCategories);
                        field.onChange(Array.from(uniqueCategoriesIds));
                      }}
                      onInputChange={(_, newInputValue) =>
                        setInputCategoryValue(newInputValue)
                      }
                      renderTags={(value: GetCategory[], getTagProps) =>
                        value.map((option: GetCategory, index: number) => {
                          const { key, ...tagProps } = getTagProps({ index });
                          return (
                            <Chip
                              {...tagProps}
                              variant='outlined'
                              label={option.name}
                              key={key}
                            />
                          );
                        })
                      }
                      inputValue={inputCategoryValue}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t('categories')}
                          variant='standard'
                          placeholder={t('selectCategories')}
                          error={Boolean(errorsStepTwo.categoryIds?.message)}
                          helperText={errorsStepTwo.categoryIds?.message}
                        />
                      )}
                    />
                  )}
                />
              </FormControl>
              <FormControl sx={{ mb: 1 }} className='w-full'>
                <Controller
                  name='compilationIds'
                  control={controlStepTwo}
                  render={({ field }) => (
                    <Autocomplete
                      multiple
                      id='compilationIds'
                      options={availableCompilations}
                      getOptionLabel={(compilation) => compilation?.title}
                      disableCloseOnSelect
                      defaultValue={availableCompilations.filter(
                        (compilation) => field.value?.includes(compilation.id),
                      )}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      onChange={(_, newValue) => {
                        const normalizedValue: GetCompilation[] = (
                          newValue as GetCompilation[]
                        ).map((value) => {
                          const existingCompilation =
                            availableCompilations.find(
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
                      onInputChange={(_, newInputValue) =>
                        setInputCompilationValue(newInputValue)
                      }
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
                          error={Boolean(errorsStepTwo.compilationIds?.message)}
                          helperText={errorsStepTwo.compilationIds?.message}
                        />
                      )}
                    />
                  )}
                />
              </FormControl>
              <FormControl sx={{ mb: 1 }} className='w-full'>
                <Controller
                  name='tags'
                  control={controlStepTwo}
                  render={({ field }) => (
                    <Autocomplete
                      multiple
                      id='tags'
                      options={availableTags.filter(
                        (tag) =>
                          !field.value?.some(
                            (value) =>
                              value.toLowerCase() === tag.toLowerCase(),
                          ),
                      )}
                      freeSolo
                      defaultValue={field.value}
                      isOptionEqualToValue={(option, value) => option === value}
                      onChange={(_, newValue) => {
                        const normalizedValue: string[] = (
                          newValue as string[]
                        ).map((value) => {
                          const existingTag = availableTags.find(
                            (tag) => tag.toLowerCase() === value.toLowerCase(),
                          );
                          return existingTag ?? value;
                        });
                        const uniqueTags = new Set<string>();
                        normalizedValue.forEach((tag) => {
                          uniqueTags.add(tag);
                        });
                        const arrayUniqueTags = Array.from(uniqueTags);
                        field.onChange(arrayUniqueTags);
                      }}
                      onInputChange={(_, newInputValue) =>
                        setInputTagValue(newInputValue)
                      }
                      renderTags={(value: Array<string>, getTagProps) =>
                        value.map((option: string, index: number) => {
                          const { key, ...tagProps } = getTagProps({ index });
                          return (
                            <Chip
                              {...tagProps}
                              variant='outlined'
                              label={option}
                              key={key}
                            />
                          );
                        })
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant='standard'
                          label={t('tags')}
                          placeholder={t('selectTags')}
                        />
                      )}
                    />
                  )}
                />
              </FormControl>
              <FormControl sx={{ mb: 1 }}>
                <Controller
                  name='imageUrl'
                  control={controlStepTwo}
                  render={({ field }) => (
                    <Badge
                      overlap='circular'
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      badgeContent={
                        <IconButton
                          component='label'
                          color='inherit'
                          sx={{ p: 0, m: 0 }}
                        >
                          <ModeEditOutlineOutlined color='primary' />
                          <VisuallyHiddenInput
                            id='imageUrl'
                            name='imageUrl'
                            type='file'
                            onChange={handleFileChange}
                          />
                        </IconButton>
                      }
                    >
                      <AvatarImage
                        type='image'
                        variant='rounded'
                        src={field.value}
                        size={112}
                        fontSize='large'
                      />
                    </Badge>
                  )}
                />
              </FormControl>
              {errorsStepTwo.imageUrl && (
                <FormHelperText
                  id='image-text'
                  error={!!errorsStepTwo.imageUrl}
                >
                  {errorsStepTwo?.imageUrl.message}
                </FormHelperText>
              )}
              <Typography className='my-4'>{t('shortDescription')}</Typography>
              {errorsStepTwo.previewContent?.message && (
                <Typography variant='body2' color='error'>
                  {errorsStepTwo.previewContent?.message}
                </Typography>
              )}
              <Controller
                name='previewContent'
                control={controlStepTwo}
                render={({ field }) => (
                  <TinyMCEEditor id='previewContent' {...field} reset={reset} />
                )}
              />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  pt: 2,
                  justifyContent: 'space-between',
                }}
              >
                <Button color='inherit' onClick={handleBack}>
                  {t('backToPublication')}
                </Button>
                <Button type='submit'>{t('sendToModerate')}</Button>
              </Box>
            </Box>
          </FormProvider>
        ),
        error: Object.keys(errorsStepTwo).length > 0,
      },
      {
        label: t('success'),
        stepContent: (
          <>
            {t('articleCreated')}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                pt: 2,
                justifyContent: 'space-between',
              }}
            >
              <Button onClick={() => handleNewArticle()}>
                {t('newArticle')}
              </Button>
              <Button type='button' onClick={onSubmit}>
                {t('openArticle')}
              </Button>
            </Box>
          </>
        ),
      },
    ],
    [
      availableCategories,
      availableCompilations,
      availableTags,
      controlStepOne,
      controlStepTwo,
      draftArticles,
      errorsStepOne,
      errorsStepTwo,
      handleDeleteArticle,
      handleFileChange,
      handleNewArticle,
      handleSelectArticle,
      handleSubmitStepOne,
      handleSubmitStepTwo,
      inputCategoryValue,
      inputCompilationValue,
      lng,
      onStepOneSubmit,
      onStepTwoSubmit,
      onSubmit,
      reset,
      t,
      zodStepOneForm,
      zodStepTwoForm,
    ],
  );

  return (
    <section className='my-10'>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel error={step.error} slots={{ stepIcon: CustomStepIcon }}>
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      {steps[activeStep].stepContent}
    </section>
  );
};
export default WithAuth(Page);
