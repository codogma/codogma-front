'use client';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Checkbox from '@mui/material/Checkbox';
import React, { useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import { PopoverElement } from '@/components/PopoverElement';
import { favorite, unfavorite } from '@/helpers/categoryApi';

interface CustomFavoriteProps {
  readonly id: number;
  readonly lang: string;
  readonly isFavoriteValue?: boolean;
  readonly refetch?: () => void;
}

export const ButtonFavorite: React.FC<CustomFavoriteProps> = ({
  id,
  lang,
  isFavoriteValue,
  refetch,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [isFavorite, setIsFavorite] = useState(isFavoriteValue);
  const { state } = useAuth();
  const { t } = useTranslation(lang, 'categories');
  const popoverId = 'simple-popover';

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
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Checkbox
        checked={isFavorite}
        onChange={handleChange}
        icon={<FavoriteBorderIcon />}
        checkedIcon={<FavoriteIcon color='error' />}
        inputProps={{ 'aria-label': 'Favorites' }}
      />
      {!state.isAuthenticated && (
        <PopoverElement
          popoverId={popoverId}
          btnEl={anchorEl}
          onClose={handlePopoverClose}
          destination={t('popoverFavorite')}
          lang={lang}
        />
      )}
    </>
  );
};
