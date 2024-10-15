import { format, formatDistanceToNow } from 'date-fns';
import { enUS, Locale, ru } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';

interface TimeAgoProps {
  readonly datetime: Date;
  readonly className?: string | undefined;
  readonly lang: string;
}

export const TimeAgo: React.FC<TimeAgoProps> = ({
  datetime,
  className,
  lang,
}) => {
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
    <time
      dateTime={datetime.toString()}
      title={formattedDate}
      className={className}
    >
      {timeAgo}
    </time>
  );
};
