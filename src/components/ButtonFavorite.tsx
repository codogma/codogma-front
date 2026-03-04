'use client';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { SxProps, Theme } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { PopoverElement } from '@/components/PopoverElement';
import { favorite, unfavorite } from '@/helpers/categoryApi';
import { getQueryClient } from '@/lib/react-query';

import { CategoryAlertDialog } from './CategoryAlertDialog';

interface CustomFavoriteProps {
  readonly id: number;
  readonly isFavoriteValue?: boolean;
  readonly sx?: SxProps<Theme>;
  readonly style?: React.CSSProperties;
}

export const ButtonFavorite: React.FC<CustomFavoriteProps> = ({
  id,
  isFavoriteValue,
  sx,
  style,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [isFavorite, setIsFavorite] = useState(isFavoriteValue);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { status } = useSession();
  const t = useTranslations('categoriesPage');
  const popoverId = 'simple-popover';
  const queryClient = getQueryClient();

  const favoriteMutation = useMutation({
    mutationFn: () => favorite(id),
    onSuccess: async () => {
      // Обновляем данные для категорий и ленты
      await queryClient.invalidateQueries({
        queryKey: ['categories'],
        refetchType: 'inactive',
      });
      await queryClient.invalidateQueries({
        queryKey: ['favorite-categories'],
        refetchType: 'inactive',
      });
      await queryClient.invalidateQueries({
        queryKey: ['feed'],
        refetchType: 'inactive',
      });
    },
  });

  const unfavoriteMutation = useMutation({
    mutationFn: () => unfavorite(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['categories'],
        refetchType: 'inactive',
      });
      await queryClient.invalidateQueries({
        queryKey: ['favorite-categories'],
        refetchType: 'inactive',
      });
      await queryClient.invalidateQueries({
        queryKey: ['feed'],
        refetchType: 'inactive',
      });
    },
  });

  const handleChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    if (status === 'authenticated') {
      if (checked) {
        await favoriteMutation.mutateAsync();
        setIsFavorite(true);
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
    await unfavoriteMutation.mutateAsync();
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
