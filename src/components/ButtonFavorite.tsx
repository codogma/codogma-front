'use client';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { SxProps, Theme } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { PopoverElement } from '@/components/PopoverElement';
import { favorite, unfavorite } from '@/helpers/categoryApi';
import CategoryAlertDialog from './CategoryAlertDialog';

interface CustomFavoriteProps {
  readonly id: number;
  readonly isFavoriteValue?: boolean;
  readonly refetch?: () => void;
  readonly sx?: SxProps<Theme>;
  readonly style?: React.CSSProperties;
}

export const ButtonFavorite: React.FC<CustomFavoriteProps> = ({
  id,
  isFavoriteValue,
  refetch,
  sx,
  style,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [isFavorite, setIsFavorite] = useState(isFavoriteValue);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { status } = useSession();
  const t = useTranslations('categoriesPage');
  const popoverId = 'simple-popover';

  const handleChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    if (status === 'authenticated') {
      if (checked) {
        setIsFavorite(true);
        await favorite(id).then(() => refetch && refetch());
      } else {
        setDialogOpen(true);
      }
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleConfirmUnfavorite = async () => {
    setIsFavorite(false);
    setDialogOpen(false);
    await unfavorite(id).then(() => refetch && refetch());
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
      {status !== 'authenticated' && (
        <PopoverElement
          popoverId={popoverId}
          btnEl={anchorEl}
          onClose={handlePopoverClose}
          destination={t('popoverFavorite')}
        />
      )}
      <CategoryAlertDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirmUnfavorite}
      />
    </>
  );
};
