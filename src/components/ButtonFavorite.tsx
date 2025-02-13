'use client';
import { Button } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import React, { useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import { favorite, unfavorite } from '@/helpers/categoryApi';

interface CustomFavoriteProps {
  readonly id: number;
  readonly username?: string;
  readonly lang: string;
  readonly isFavoriteValue?: boolean;
  readonly refetch?: () => void;
}

export const ButtonFavorite: React.FC<CustomFavoriteProps> = ({
  id,
  username,
  lang,
  isFavoriteValue,
  refetch,
}) => {
  const [isFavorite, setIsFavorite] = useState(isFavoriteValue);
  const { state } = useAuth();
  const { t } = useTranslation(lang, 'categories');

  const handleChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    if (state.isAuthenticated) {
      setIsFavorite(checked);

      if (checked) {
        await favorite(id).then(() => refetch && refetch());
      } else {
        await unfavorite(id).then(() => refetch && refetch());
      }
    }
  };

  return state.user?.username !== username ? (
    <>
      <Checkbox
        checked={isFavorite}
        onChange={handleChange}
        icon={<Button className='article-btn'>{t('addToFavorite')}</Button>}
        checkedIcon={
          <Button className='article-red-btn'>{t('removeFromFavorite')}</Button>
        }
        inputProps={{ 'aria-label': 'Favorites' }}
      />
    </>
  ) : null;
};
