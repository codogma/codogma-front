import { Box, BoxProps } from '@mui/material';
import { format, formatDistanceToNow } from 'date-fns';
import { enUS, Locale, ru } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';

import { Language } from '@/types';

interface TimeAgoProps extends BoxProps {
  readonly datetime: Date;
  readonly lang: Language;
}

export const TimeAgo = ({ datetime, lang, ...props }: TimeAgoProps) => {
  const [timeAgo, setTimeAgo] = useState<string>('');
  const [locale, setLocale] = useState<Locale>(enUS);

  useEffect(() => {
    const updateTime = () => {
      setTimeAgo(formatDistanceToNow(datetime, { addSuffix: true, locale }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [datetime, locale]);

  useEffect(() => {
    if (lang === 'en') {
      setLocale(enUS);
    }
    if (lang === 'ru') {
      setLocale(ru);
    }
  }, [lang]);

  const formattedDate = format(datetime, 'yyyy-MM-dd, HH:mm', {
    locale,
  });

  return (
    <Box
      component='time'
      dateTime={datetime.toString()}
      title={formattedDate}
      {...props}
    >
      {timeAgo}
    </Box>
  );
};
