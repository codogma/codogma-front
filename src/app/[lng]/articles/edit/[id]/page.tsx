'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Chip, MenuItem, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { z } from 'zod';

import { useAuth } from '@/components/AuthProvider';
import FormInput from '@/components/FormInput';
import { TinyMCEEditor } from '@/components/TinyMCEEditor';
import { WithAuth } from '@/components/WithAuth';
import { languageMenuItems } from '@/constants/i18n';
import {
  deleteArticle,
  getArticleById,
  updateArticle,
  UpdateArticleDTO,
} from '@/helpers/articleApi';
import { getCategories } from '@/helpers/categoryApi';
import { devConsoleError } from '@/helpers/devConsoleLogs';
import { getTagsByName } from '@/helpers/tagApi';
import { Article, Category, Language, Tag } from '@/types';

const ArticleScheme = z.object({
  categoryIds: z.array(z.number()),
  title: z
    .string()
    .min(2, 'Название статьи не может содержать менее 2 символов.')
    .max(300, 'Название статьи не может содержать более 300 символов.'),
  content: z.string(),
  previewContent: z.string(),
  tags: z.array(z.string()).optional(),
  language: z.nativeEnum(Language).optional(),
});

type PageParams = {
  id: number;
};

type PageProps = {
  readonly params: PageParams;
};

const Page = ({ params }: PageProps) => {
  const articleId: number = params.id;
  const router = useRouter();
  const { state } = useAuth();
  const [article, setArticle] = useState<Article>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [inputTagValue, setInputTagValue] = useState<string>('');
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  const zodForm = useForm<z.infer<typeof ArticleScheme>>({
    resolver: zodResolver(ArticleScheme),
    defaultValues: {
      categoryIds: [],
      title: '',
      content: '',
      tags: [],
      previewContent: '',
      language: Language.EN,
    },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const articleData = await getArticleById(articleId);
        setArticle(articleData);
        if (state.user?.username !== articleData.username) {
          router.push('/not-found');
        }

        const allCategories = await getCategories();
        setCategories(allCategories);

        zodForm.reset({
          categoryIds: articleData.categories.map((category) => category.id),
          title: articleData.title,
          content: articleData.content,
          previewContent: articleData.previewContent,
          tags: articleData.tags.map((tag) => tag.name),
        });
      } catch (error) {
        router.push('/not-found');
        devConsoleError('Error fetching data:', error);
      }
    }

    fetchData();
  }, [articleId, router, state.user?.username, zodForm]);

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

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitSuccessful, errors },
  } = zodForm;

  useEffect(() => {
    // console.log(errors)
    if (isSubmitSuccessful) {
      reset(zodForm.getValues());
    }
  }, [isSubmitSuccessful, reset, errors, zodForm]);

  const onSubmit: SubmitHandler<z.infer<typeof ArticleScheme>> = (formData) => {
    const requestData: UpdateArticleDTO = {
      ...formData,
      language: formData.language?.toUpperCase(),
    };
    devConsoleError(requestData);
    updateArticle(articleId, requestData).then(() =>
      router.push(`/articles/${articleId}`),
    );
  };

  const handleDelete = () => {
    deleteArticle(articleId).then(() => router.push('/articles'));
  };

  return (
    <main className='my-10'>
      <Link href={`/articles/${articleId}`}>
        <Button className='article-btn' variant='outlined'>
          Back to article
        </Button>
      </Link>
      <FormProvider {...zodForm}>
        <Box
          component='form'
          noValidate
          // sx={{m: 1, ml: '20ch', mr: '20ch'}}
          autoComplete='off'
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            name='categoryIds'
            control={control}
            render={({ field }) => (
              <Autocomplete
                multiple
                id='categories'
                options={categories}
                defaultValue={article?.categories}
                getOptionLabel={(category) => category?.name}
                filterSelectedOptions
                value={categories.filter((category) =>
                  field.value.includes(category.id),
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(_, newValue) =>
                  field.onChange(newValue.map((category) => category.id))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label='Categories'
                    variant='standard'
                    placeholder='Select categories'
                  />
                )}
              />
            )}
          />
          <Controller
            name='language'
            control={control}
            render={({ field }) => (
              <TextField
                select
                label='Language'
                variant='standard'
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
          <Controller
            name='tags'
            control={control}
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
                defaultValue={article?.tags.map((tag) => tag.name)}
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
          <FormInput name='title' label='Title' variant='standard' />
          <Typography className='my-4'>Краткое описание:</Typography>
          <Controller
            name='previewContent'
            control={control}
            render={({ field }) => (
              <TinyMCEEditor
                defaultValue={article?.previewContent}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Typography className='my-4'>Основная статья:</Typography>
          <Controller
            name='content'
            control={control}
            render={({ field }) => (
              <TinyMCEEditor
                defaultValue={article?.content}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <div className='flex w-full justify-between'>
            <Button type='submit'>Update</Button>
            <Button
              id={articleId.toString()}
              style={{ color: 'red' }}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </Box>
      </FormProvider>
    </main>
  );
};

export default WithAuth(Page);
