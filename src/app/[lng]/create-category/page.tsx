'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { ModeEditOutlineOutlined } from '@mui/icons-material';
import { Badge, Box, Button, FormHelperText } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { AvatarImage } from '@/components/AvatarImage';
import FormInput from '@/components/FormInput';
import { WithAuth } from '@/components/WithAuth';
import { createCategory } from '@/helpers/categoryApi';
import { devConsoleError } from '@/helpers/devConsoleLogs';

const CategoryScheme = z.object({
  name: z
    .string()
    .min(2, 'Название категории не может содержать менее 2 символов.')
    .max(50, 'Название категории не может содержать более 50 символов.'),
  image: z.instanceof(File, {
    message: 'Изображение обязательно для загрузки.',
  }),
  description: z.optional(z.string()),
});

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

function Page() {
  const [imageFile, setImageFile] = useState<File>();
  const [imageUrl, setImageUrl] = useState<string>();

  const zodForm = useForm<z.infer<typeof CategoryScheme>>({
    resolver: zodResolver(CategoryScheme),
    defaultValues: {
      name: '',
      image: undefined,
      description: '',
    },
  });

  const {
    reset,
    handleSubmit,
    setValue,
    trigger,
    formState: { isSubmitSuccessful, errors },
  } = zodForm;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(zodForm.getValues());
    }
  }, [isSubmitSuccessful, reset, zodForm]);

  const onSubmit: SubmitHandler<z.infer<typeof CategoryScheme>> = (
    formData,
  ) => {
    const requestData = { ...formData, image: imageFile };
    devConsoleError(requestData);
    createCategory(requestData);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
      setValue('image', file);
      trigger('image');
    }
  };

  return (
    <main className='flex min-h-screen max-w-3xl flex-col items-start justify-self-auto p-24'>
      <FormProvider {...zodForm}>
        <Box
          component='form'
          noValidate
          sx={{
            m: 1,
            width: '25ch',
          }}
          autoComplete='off'
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormInput name='name' label='Name' variant='standard' />
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
              type='image'
              variant='rounded'
              src={imageUrl}
              size={112}
              fontSize='large'
            />
          </Badge>
          {errors.image && (
            <FormHelperText id='image-text' error={!!errors.image}>
              {errors?.image.message}
            </FormHelperText>
          )}
          <FormInput
            name='description'
            label='Description'
            variant='standard'
          />
          <Button type='submit'>Create</Button>
        </Box>
      </FormProvider>
    </main>
  );
}

export default WithAuth(Page);
