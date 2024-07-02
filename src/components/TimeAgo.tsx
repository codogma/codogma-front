import React, { useEffect, useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';

interface TimeAgoProps {
    datetime: Date;
}

export const TimeAgo: React.FC<TimeAgoProps> = ({ datetime }) => {
    const [timeAgo, setTimeAgo] = useState<string>('');

    useEffect(() => {
        const updateTime = () => {
            setTimeAgo(formatDistanceToNow(datetime, { addSuffix: true }));
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, [datetime]);

    const formattedDate = format(datetime, "yyyy-MM-dd, HH:mm");

    return (
        <time dateTime={datetime.toString()} title={formattedDate}>
            {timeAgo}
        </time>
    );
};