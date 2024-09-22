import React, { useEffect, useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';

interface TimeAgoProps {
  datetime: Date;
  className?: string | undefined;
}

export const TimeAgo: React.FC<TimeAgoProps> = ({ datetime, className }) => {
  const [timeAgo, setTimeAgo] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      setTimeAgo(formatDistanceToNow(datetime, { addSuffix: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [datetime]);

  const formattedDate = format(datetime, 'yyyy-MM-dd, HH:mm');

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
