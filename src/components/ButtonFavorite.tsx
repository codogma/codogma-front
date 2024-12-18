'use client';
import { Button } from '@mui/material';
import React, { useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import { favorite, unfavorite } from '@/helpers/categoryApi';

interface CustomFavoriteProps {
  readonly id: number;
  readonly username?: string;
  readonly lang: string;
  readonly isFavoriteValue?: boolean;
}

export const ButtonFavorite: React.FC<CustomFavoriteProps> = ({
  id,
  username,
  lang,
  isFavoriteValue,
}) => {
  const [isFavorite, setIsFavorite] = useState(isFavoriteValue);
  const { state } = useAuth();
  const { t } = useTranslation(lang, 'categories');

  const handleUnfavorite = async () => {
    if (state.isAuthenticated) {
      await unfavorite(id).then((response) =>
        setIsFavorite(response.isFavorite),
      );
    }
  };

  const handleFavorite = async () => {
    if (state.isAuthenticated) {
      await favorite(id).then((response) => setIsFavorite(response.isFavorite));
    }
  };

  return state.user?.username !== username ? (
    <>
      {isFavorite ? (
        <Button className='article-red-btn' onClick={handleUnfavorite}>
          {t('removeFromFavorite')}
        </Button>
      ) : (
        <Button className='article-btn' onClick={handleFavorite}>
          {t('addToFavorite')}
        </Button>
      )}
    </>
  ) : null;
};
