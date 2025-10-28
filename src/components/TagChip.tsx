import { Chip } from '@mui/material';
import React from 'react';

import { GetTag } from '@/types';

export const TagChip = ({ tag }: { readonly tag: GetTag }) => {
  return <Chip variant='outlined' clickable label={tag.name} />;
};
