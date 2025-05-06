'use client';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { SxProps, Theme } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import React, { useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import { PopoverElement } from '@/components/PopoverElement';
import { favorite, unfavorite } from '@/helpers/categoryApi';
import { Language } from '@/types';

interface CustomFavoriteProps {
  readonly id: number;
  readonly lang: Language;
  readonly isFavoriteValue?: boolean;
  readonly refetch?: () => void;
  readonly sx?: SxProps<Theme>;
  readonly style?: React.CSSProperties;
}

export const ButtonFavorite: React.FC<CustomFavoriteProps> = ({
  id,
  lang,
  isFavoriteValue,
  refetch,
  sx,
  style,
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
        icon={<FavoriteBorderIcon style={style} />}
        checkedIcon={<FavoriteIcon color='error' />}
        slotProps={{ input: { 'aria-label': 'Favorites' } }}
        sx={sx}
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
