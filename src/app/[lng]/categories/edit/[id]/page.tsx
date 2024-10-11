'use client';
import { z } from 'zod';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { Category, UserRole } from '@/types';
import {
  deleteCategory,
  getCategoryById,
  updateCategory,
} from '@/helpers/categoryApi';
import { Badge, Box, Button } from '@mui/material';
import FormInput from '@/components/FormInput';
import { WithAuth } from '@/components/WithAuth';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import IconButton from '@mui/material/IconButton';
import { ModeEditOutlineOutlined } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { AvatarImage } from '@/components/AvatarImage';

const CategoryScheme = z.object({
  name: z.optional(
    z
      .string()
      .min(2, 'Название категории не может содержать менее 2 символов.')
      .max(50, 'Название категории не может содержать более 50 символов.'),
  ),
  image: z.optional(z.instanceof(File)),
  description: z.optional(z.string()),
});

type PageParams = {
  id: number;
};

type PageProps = {
  params: PageParams;
};

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

function Categories({ params }: PageProps) {
  const categoryId: number = params.id;
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>('');
  const [alertSeverity, setAlertSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('info');
  const [category, setCategory] = useState<Category>();
  const [imageFile, setImageFile] = useState<File>();
  const { state } = useAuth();

  const zodForm = useForm<z.infer<typeof CategoryScheme>>({
    resolver: zodResolver(CategoryScheme),
    defaultValues: {
      name: '',
      image: undefined,
      description: '',
    },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const categoryData = await getCategoryById(categoryId);
        setCategory(categoryData);

        zodForm.reset({
          name: categoryData.name,
          description: categoryData.description,
          image: undefined,
        });
      } catch (error) {
        console.error('Error fetching data: ' + error);
      }
    }

    fetchData();
  }, [categoryId, zodForm]);

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful, errors },
  } = zodForm;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(zodForm.getValues());
    }
  }, [isSubmitSuccessful, reset, zodForm]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setCategory((prev) =>
        prev ? { ...prev, imageUrl: URL.createObjectURL(file) } : prev,
      );
    }
  };

  const onSubmit: SubmitHandler<z.infer<typeof CategoryScheme>> = (
    formData,
  ) => {
    const requestData = { ...formData, image: imageFile };
    updateCategory(categoryId, requestData)
      .then(() => {
        setAlertSeverity('success');
        setAlertText('Category updated successfully');
        setOpen(true);
      })
      .catch((error) => {
        setAlertSeverity('error');
        setAlertText(error);
        setOpen(true);
      });
  };

  const handleDelete = () => {
    deleteCategory(categoryId);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  if (state.user?.role === UserRole.ROLE_ADMIN) {
    return (
      <main className='flex min-h-screen max-w-3xl flex-col items-start justify-self-auto p-24'>
        <Link href={`/categories/${categoryId}`}>
          <Button className='article-btn' variant='outlined'>
            Back to category
          </Button>
        </Link>
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
                alt={category?.name}
                variant='rounded'
                src={category?.imageUrl}
                size={112}
                fontSize='large'
              />
            </Badge>
            <FormInput
              name='name'
              label='Name'
              variant='standard'
              defaultValue={category?.name}
            />
            <FormInput
              name='description'
              label='Description'
              variant='standard'
              defaultValue={category?.description}
            />
            <Button type='submit'>Update</Button>
            <Button
              className='article-btn'
              variant='outlined'
              onClick={handleDelete}
            >
              Delete category
            </Button>
          </Box>
        </FormProvider>
        <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={alertSeverity}
            variant='filled'
            sx={{ width: '100%' }}
          >
            {alertText}
          </Alert>
        </Snackbar>
      </main>
    );
  } else {
    router.push('/not-found');
  }
}

export default WithAuth(Categories);
