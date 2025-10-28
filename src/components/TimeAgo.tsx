import { Box, BoxProps } from '@mui/material';
import { format, formatDistanceToNow } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';
import React from 'react';

import { Language } from '@/types';

interface TimeAgoProps extends BoxProps {
  readonly datetime: Date;
  readonly lang: Language;
}

export const TimeAgo = ({ datetime, lang, ...props }: TimeAgoProps) => {
  const locale = lang === 'ru' ? ru : enUS;

  const staticTimeAgo = formatDistanceToNow(datetime, {
    addSuffix: true,
    locale,
  });
  const formattedDate = format(datetime, 'yyyy-MM-dd, HH:mm', { locale });

  return (
    <Box
      component='time'
      dateTime={datetime.toString()}
      title={formattedDate}
      {...props}
    >
      {staticTimeAgo}
    </Box>
  );
};
