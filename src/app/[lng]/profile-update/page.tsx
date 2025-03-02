'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { ModeEditOutlineOutlined } from '@mui/icons-material';
import { Badge, Box, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React, { MouseEvent, useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import { AvatarImage } from '@/components/AvatarImage';
import FormInput from '@/components/FormInput';
import { WithAuth } from '@/components/WithAuth';
import { devConsoleError } from '@/helpers/devConsoleLogs';
import {
  deleteUser,
  getUserByUsername,
  updateUser,
  UserUpdate,
} from '@/helpers/userApi';
import { GetUserDTO, Language } from '@/types';

const UserScheme = z.object({
  username: z.optional(
    z
      .string()
      .min(2, 'Имя пользователя не может содержать менее 2 символов.')
      .max(50, 'Имя пользователя не может содержать более 50 символов.'),
  ),
  avatar: z.optional(z.instanceof(File)),
  firstName: z.optional(
    z
      .string()
      .min(2, 'Имя не может содержать менее 2 символов.')
      .max(50, 'Имя не может содержать более 50 символов.'),
  ),
  lastName: z.optional(z.string()),
  bio: z.optional(z.string()),
  newEmail: z.optional(z.string()),
  currentPassword: z.optional(z.string()),
  newPassword: z.optional(z.string()),
  shortInfo: z.optional(z.string()),
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

type PageParams = {
  lng: Language;
};

type PageProps = {
  readonly params: PageParams;
};

function Page({ params: { lng } }: PageProps) {
  const { state } = useAuth();
  const username: string | undefined = state.user?.username;
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const { t } = useTranslation(lng);

  const zodForm = useForm<z.infer<typeof UserScheme>>({
    resolver: zodResolver(UserScheme),
    defaultValues: {
      username: '',
      avatar: undefined,
      firstName: '',
      lastName: '',
      bio: '',
      newEmail: '',
      currentPassword: '',
      newPassword: '',
      shortInfo: '',
    },
  });

  const { reset, handleSubmit, setValue, trigger } = zodForm;

  const { data } = useQuery<GetUserDTO>({
    queryKey: ['user', username],
    queryFn: () => getUserByUsername(username),
  });

  const user: GetUserDTO = data as GetUserDTO;

  useEffect(() => {
    reset({
      username: user?.username,
      avatar: undefined,
      firstName: user?.firstName,
      lastName: user?.lastName,
      bio: user?.bio,
      newEmail: user?.email,
      currentPassword: undefined,
      newPassword: undefined,
      shortInfo: user?.shortInfo,
    });
  }, [reset, user]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarUrl(URL.createObjectURL(file));
      setValue('avatar', file);
      trigger('avatar');
    }
  };

  const onSubmit: SubmitHandler<z.infer<typeof UserScheme>> = (formData) => {
    const updatedUserData: UserUpdate = {
      ...formData,
    };
    devConsoleError(updatedUserData);
    updateUser(updatedUserData);
  };

  const handleDelete = (event: MouseEvent<HTMLElement>) => {
    const userId = event.currentTarget.id;
    deleteUser(userId);
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
          <Badge
            overlap='circular'
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <IconButton component='label' color='inherit' sx={{ p: 0 }}>
                <ModeEditOutlineOutlined color='primary' />
                <VisuallyHiddenInput
                  id='avatar'
                  name='avatar'
                  type='file'
                  onChange={handleFileChange}
                />
              </IconButton>
            }
          >
            <AvatarImage
              alt={user?.username}
              type='avatar'
              variant='rounded'
              src={avatarUrl ?? user?.avatarUrl}
              size={112}
            />
          </Badge>
          <FormInput
            name='username'
            label='Username'
            variant='standard'
            defaultValue={user?.username}
          />
          <FormInput
            name='newEmail'
            label='Email'
            type='email'
            variant='standard'
            defaultValue={user?.email}
          />
          <FormInput
            name='firstName'
            label='First name'
            variant='standard'
            defaultValue={user?.firstName}
          />
          <FormInput
            name='lastName'
            label='Last name'
            variant='standard'
            defaultValue={user?.lastName}
          />
          <FormInput
            name='bio'
            label='Bio'
            variant='standard'
            defaultValue={user?.bio}
          />
          <FormInput
            name='shortInfo'
            label='ShortInfo'
            variant='standard'
            defaultValue={user?.shortInfo}
          />
          <FormInput
            name='currentPassword'
            label='Current password'
            type='password'
            variant='standard'
          />
          <FormInput
            name='newPassword'
            label='New password'
            type='password'
            variant='standard'
          />
          <Button type='submit'>{t('updateBtn')}</Button>
          <Link href={`/authors`}>
            <Button id={user?.username} onClick={handleDelete}>
              {t('deleteBtn')}
            </Button>
          </Link>
        </Box>
      </FormProvider>
    </main>
  );
}

export default WithAuth(Page);
