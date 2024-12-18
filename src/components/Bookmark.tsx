'use client';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { Link, Popover, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { useAuth } from '@/components/AuthProvider';
import { bookmark, unbookmark } from '@/helpers/articleApi';

interface BookmarkProps {
  readonly destination?: string;
  readonly username?: string;
  readonly id: number;
  readonly isBookmarkedValue?: boolean;
}

export const Bookmark: React.FC<BookmarkProps> = ({
  destination = 'to subscribe to a user',
  username,
  id,
  isBookmarkedValue,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const [isBookmarked, setIsBookmarked] = useState(isBookmarkedValue);
  const { state } = useAuth();
  const router = useRouter();
  const open = Boolean(anchorEl);
  const popoverId = open ? 'simple-popover' : undefined;

  const handleUnbookmark = async () => {
    if (state.isAuthenticated) {
      await unbookmark(id).then((response) =>
        setIsBookmarked(response.isBookmarked),
      );
    }
  };

  const handleBookmark = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (state.isAuthenticated) {
      await bookmark(id).then((response) =>
        setIsBookmarked(response.isBookmarked),
      );
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClickLink = (url: string) => {
    router.push(url);
    handlePopoverClose();
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return state.user?.username !== username ? (
    <>
      {isBookmarked ? (
        <IconButton onClick={handleUnbookmark}>
          <BookmarkIcon color='error' />
        </IconButton>
      ) : (
        <IconButton onClick={handleBookmark}>
          <BookmarkIcon aria-describedby={popoverId} />
        </IconButton>
      )}
      {!state.isAuthenticated && (
        <Popover
          id={popoverId}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClose={handlePopoverClose}
        >
          <Typography
            variant='body2'
            sx={{ pl: '16px', pr: '16px', pt: '12px', pb: '12px' }}
          >
            <Link
              component='button'
              underline='none'
              onClick={() => handleClickLink('/sign-up')}
              sx={{ mr: '5px', verticalAlign: 'unset' }}
            >
              Sign up
            </Link>
            {destination}
          </Typography>
        </Popover>
      )}
    </>
  ) : null;
};
