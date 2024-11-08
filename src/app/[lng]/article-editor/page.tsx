'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { CloudDone } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  MenuItem,
  Step,
  StepIcon,
  StepIconProps,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMutation, useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { z } from 'zod';

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
import { getCategories } from '@/helpers/categoryApi';
import { devConsoleError } from '@/helpers/devConsoleLogs';
import { getTagsByName } from '@/helpers/tagApi';
import { Article, Category, Language, Tag } from '@/types';

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
  previewContent: z.string().min(1, 'Краткое описание не может быть пустым.'),
  categoryIds: z.array(z.number()).min(1, 'Выберите хотя бы одну категорию.'),
  tags: z.array(z.string()),
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

const Page = ({ params: { lng } }: PageParams) => {
  const STEP_ONE_DATA = 'step-one-data';
  const STEP_TWO_DATA = 'step-two-data';
  const ARTICLE_ID = 'article-id';
  const PARAM_ID = 'id';
  const route = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const paramId = searchParams.get(PARAM_ID);
  const id = Number(paramId);
  const [stepOneData, setStepOneData] = useState<CreateDraftArticleDTO | null>(
    null,
  );
  const [reset, setReset] = useState<boolean>(false);
  const [stepTwoData, setStepTwoData] = useState(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [articleId, setArticleId] = useState<number>(0);
  const [draftArticles, setDraftArticles] = useState<Article[]>([]);
  const [inputTagValue, setInputTagValue] = useState<string>('');
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [prevData, setPrevData] = useState<UpdateDraftArticleDTO | null>(null);

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
      previewContent: '',
      categoryIds: [],
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
    watch: watchStepTwo,
  } = zodStepTwoForm;

  const { data: categoriesData } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  });

  const categories: Category[] = (categoriesData as Category[]) || [];

  const { data: draftArticlesData, refetch } = useQuery<Article[]>({
    queryKey: ['draftArticles'],
    queryFn: () => getDraftArticles(),
  });

  const isValidId = (validatingId: number) => {
    return !isNaN(validatingId) && validatingId > 0;
  };

  const { data: article } = useQuery<Article>({
    queryKey: ['article', id],
    queryFn: () => getDraftedArticleById(id),
    enabled: () => {
      return isValidId(id);
    },
  });

  useEffect(() => {
    if (Array.isArray(draftArticlesData)) {
      setDraftArticles(draftArticlesData);
    }
  }, [draftArticlesData]);

  const deleteArticleData = useCallback(() => {
    setArticleId(0);
    resetStepOne({ title: '', content: '' });
    resetStepTwo({
      language: lng,
      originalArticleId: null,
      previewContent: '',
      categoryIds: [],
      tags: [],
    });
    setReset(true);
    setPrevData(null);
    setActiveStep(0);
    setStepOneData(null);
    setStepTwoData(null);
    localStorage.removeItem(STEP_ONE_DATA);
    localStorage.removeItem(STEP_TWO_DATA);
    localStorage.removeItem(ARTICLE_ID);
  }, [resetStepOne, resetStepTwo, lng]);

  const handleDeleteArticle = (id: number) => {
    deleteArticle(id).then(() => {
      refetch().then((response) => {
        if (Array.isArray(response.data)) {
          setDraftArticles(response.data);
        }
      });
      deleteArticleData();
    });
  };

  const setArticleData = useCallback(
    (article: Article) => {
      if (isValidId(article.id)) setArticleId(article.id);
      localStorage.setItem(ARTICLE_ID, String(article.id));
      resetStepOne({ title: article.title, content: article.content });
      resetStepTwo({
        language: article.language || lng,
        originalArticleId: article.originalArticleId,
        previewContent: article.previewContent,
        categoryIds: article.categories.map((category) => category.id),
        tags: article.tags.map((tag) => tag.name),
      });
    },
    [resetStepOne, resetStepTwo, lng],
  );

  const handleSelectArticle = (article: Article) => {
    setArticleData(article);
  };

  const handleNewArticle = () => {
    deleteArticleData();
  };

  useEffect(() => {
    if (article) {
      setArticleData(article);
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
    route.replace(pathname);
  }, [article, pathname, resetStepOne, resetStepTwo, route, setArticleData]);

  useEffect(() => {
    if (inputTagValue === '') {
      setAvailableTags([]);
      return;
    }

    const fetchTags = async () => {
      try {
        const tagObjects: Tag[] = await getTagsByName(inputTagValue);
        const tagNames = tagObjects.map((tag) => tag.name);
        setAvailableTags(tagNames);
      } catch (error) {
        devConsoleError('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, [inputTagValue]);

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
          setStepOneData(data);
          localStorage.setItem(STEP_ONE_DATA, JSON.stringify(data));
        }
      });
      const subscriptionStepTwo = watchStepTwo((data) => {
        if (data) {
          setStepTwoData(data);
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
      refetch().then((response) => {
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
      refetch().then((response) => {
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
    const parsedStepOneData = JSON.parse(lsStepOneData);
    if (parsedStepOneData && stepOneData?.title && !isValidId(articleId)) {
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
      if (JSON.stringify(currentData) !== JSON.stringify(prevData)) {
        const timer = setTimeout(() => {
          updateDraftArticleMutate(currentData);
          setPrevData(currentData);
        }, 5000);
        return () => clearTimeout(timer);
      }
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

  const onStepOneSubmit: SubmitHandler<z.infer<typeof StepOneScheme>> = (
    formData,
  ) => {
    setStepOneData({ ...formData });
    handleNext();
  };

  const onStepTwoSubmit: SubmitHandler<z.infer<typeof StepTwoScheme>> = (
    formData,
  ) => {
    if (stepOneData && formData) {
      const requestData: UpdateArticleDTO = {
        ...stepOneData,
        ...formData,
      } as UpdateArticleDTO;
      updateArticleMutate(requestData);
    }
    handleNext();
    localStorage.removeItem(STEP_ONE_DATA);
    localStorage.removeItem(STEP_TWO_DATA);
    localStorage.removeItem(ARTICLE_ID);
  };

  const onSubmit = () => {
    route.push(`/articles/${articleId}`);
  };

  const steps: StepType[] = [
    {
      label: 'Main content',
      stepContent: (
        <FormProvider {...zodStepOneForm}>
          <Box
            component='form'
            noValidate
            autoComplete='off'
            onSubmit={handleSubmitStepOne(onStepOneSubmit)}
          >
            <Box alignItems='center' display='flex' alignContent='center'>
              <FormInput
                className='w-full flex-1'
                name='title'
                label='Title'
                variant='standard'
              />
              {draftArticles.length > 0 && (
                <LinkWithPopover
                  draftArticles={draftArticles}
                  onDeleteArticle={handleDeleteArticle}
                  onSelectArticle={handleSelectArticle}
                />
              )}
            </Box>
            <Typography className='my-4'>Основная статья:</Typography>
            {errorsStepOne.content?.message && (
              <Typography variant='body2' color='error'>
                {errorsStepOne.content?.message}
              </Typography>
            )}
            <Controller
              name='content'
              control={controlStepOne}
              render={({ field }) => (
                <TinyMCEEditor
                  reset={reset}
                  value={field.value}
                  onChange={field.onChange}
                />
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
              <Button type='submit' onClick={() => handleNewArticle()}>
                New article
              </Button>
              <Button type='submit'>Proceed to settings</Button>
            </Box>
          </Box>
        </FormProvider>
      ),
      error: Object.keys(errorsStepOne).length > 0,
    },
    {
      label: 'Settings and preview content',
      stepContent: (
        <FormProvider {...zodStepTwoForm}>
          <Box
            component='form'
            noValidate
            autoComplete='off'
            onSubmit={handleSubmitStepTwo(onStepTwoSubmit)}
          >
            <Controller
              name='categoryIds'
              control={controlStepTwo}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  id='categoryIds'
                  options={categories}
                  getOptionLabel={(category) => category?.name}
                  filterSelectedOptions
                  value={categories.filter((category) =>
                    field.value?.includes(category.id),
                  )}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  onChange={(_, newValue) =>
                    field.onChange(newValue.map((category) => category.id))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Categories'
                      variant='standard'
                      placeholder='Select categories'
                      error={Boolean(errorsStepTwo.categoryIds?.message)}
                      helperText={errorsStepTwo.categoryIds?.message}
                    />
                  )}
                />
              )}
            />
            <Controller
              name='language'
              control={controlStepTwo}
              render={({ field }) => (
                <TextField
                  select
                  label='Language'
                  variant='standard'
                  value={field.value}
                  onChange={field.onChange}
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
                        (value) => value.toLowerCase() === tag.toLowerCase(),
                      ),
                  )}
                  freeSolo
                  value={field.value}
                  onChange={(_, newValue) => {
                    const normalizedValue = newValue.map((value) => {
                      const existingTag = availableTags.find(
                        (tag) => tag.toLowerCase() === value.toLowerCase(),
                      );
                      return existingTag || value;
                    });

                    const uniqueTags = new Set<string>();
                    normalizedValue.forEach((tag) => {
                      uniqueTags.add(tag);
                    });

                    field.onChange(Array.from(uniqueTags));
                  }}
                  onInputChange={(_, newInputValue) =>
                    setInputTagValue(newInputValue)
                  }
                  renderTags={(value: string[], getTagProps) =>
                    value.map((option: string, index: number) => {
                      const { key, ...tagProps } = getTagProps({ index });
                      return (
                        <Chip
                          variant='outlined'
                          label={option}
                          key={key}
                          {...tagProps}
                        />
                      );
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='standard'
                      label='Tags'
                      placeholder='Select or create tags'
                    />
                  )}
                />
              )}
            />
            <Typography className='my-4'>Краткое описание:</Typography>
            {errorsStepTwo.previewContent?.message && (
              <Typography variant='body2' color='error'>
                {errorsStepTwo.previewContent?.message}
              </Typography>
            )}
            <Controller
              name='previewContent'
              control={controlStepTwo}
              render={({ field }) => (
                <TinyMCEEditor
                  reset={reset}
                  value={field.value}
                  onChange={field.onChange}
                />
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
                Back to publication
              </Button>
              <Button type='submit'>Send to moderate</Button>
            </Box>
          </Box>
        </FormProvider>
      ),
      error: Object.keys(errorsStepTwo).length > 0,
    },
    {
      label: 'Success',
      stepContent: (
        <>
          Article created successfully!
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              pt: 2,
              justifyContent: 'flex-end',
            }}
          >
            <Button type='button' onClick={onSubmit}>
              Open created article
            </Button>
          </Box>
        </>
      ),
    },
  ];

  return (
    <section className='my-10'>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel error={step.error} StepIconComponent={CustomStepIcon}>
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
