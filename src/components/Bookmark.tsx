'use client';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Checkbox from '@mui/material/Checkbox';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { PopoverElement } from '@/components/PopoverElement';
import { bookmark, unbookmark } from '@/helpers/compilationApi';

interface BookmarkProps {
  readonly username?: string;
  readonly id: number;
  readonly isBookmarkedValue?: boolean;
  readonly refetch?: () => void;
}

export const Bookmark: React.FC<BookmarkProps> = ({
  username,
  id,
  isBookmarkedValue,
  refetch,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(isBookmarkedValue);
  const { data: state, status } = useSession();
  const t = useTranslations('articlesPage');
  const popoverId = 'simple-popover';

  const handleChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    if (status) {
      setIsBookmarked(checked);

      if (checked) {
        await bookmark(id).then(() => refetch && refetch());
      } else {
        await unbookmark(id).then(() => refetch && refetch());
      }
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return state?.user?.name !== username ? (
    <>
      <Checkbox
        checked={isBookmarked}
        onChange={handleChange}
        icon={<BookmarkIcon aria-describedby={popoverId} />}
        checkedIcon={<BookmarkIcon color='error' />}
        inputProps={{ 'aria-label': 'Bookmark compilation' }}
      />
      {!status && (
        <PopoverElement
          popoverId={popoverId}
          btnEl={anchorEl}
          onClose={handlePopoverClose}
          destination={t('popoverBookmark')}
        />
      )}
    </>
  ) : null;
};
