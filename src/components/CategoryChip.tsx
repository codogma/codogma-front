import { Chip } from '@mui/material';
import React from 'react';

import { AvatarImage } from '@/components/AvatarImage';
import { GetCategory } from '@/types';

type CategoryChipProps = {
  readonly category: GetCategory;
};

export const CategoryChip = ({ category }: CategoryChipProps) => {
  return (
    <Chip
      variant='outlined'
      label={category.name}
      clickable
      avatar={
        <AvatarImage
          alt={category?.name}
          src={category?.icon?.imageUrl}
          variant='circular'
          size={24}
        />
      }
    />
  );
};
