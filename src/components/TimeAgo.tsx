import React, { useEffect, useState } from 'react';
import { formatDistanceToNow, format, parseISO } from 'date-fns';

interface TimeAgoProps {
    datetime: Date;
}

const TimeAgo: React.FC<TimeAgoProps> = ({ datetime }) => {
    const [timeAgo, setTimeAgo] = useState<string>('');
    console.log(datetime.toISOString())
    useEffect(() => {
        const date = new Date("2022-01-01T00:00:00Z");

        const updateTime = () => {
            setTimeAgo(formatDistanceToNow(date, { addSuffix: true }));
        };

        updateTime();
        const interval = setInterval(updateTime, 60000); // обновлять каждую минуту

        return () => clearInterval(interval);
    }, [datetime]);

    const formattedDate = format(new Date("2022-01-01T00:00:00Z"), "yyyy-MM-dd, HH:mm");

    return (
        <time dateTime={datetime.toISOString()} title={formattedDate}>
            {timeAgo}
        </time>
    );
};

export default TimeAgo;