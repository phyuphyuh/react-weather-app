import React, { useState, useEffect } from 'react';

const DateTime = ({ weather }) => {
  const [date, setDate] = useState('');

  useEffect(() => {
    if (!weather) return;

    const updateTime = () => {
      const today = new Date();
      const utcOffsetInMinutes = today.getTimezoneOffset();
      const localOffsetInSeconds = weather.timezone + utcOffsetInMinutes * 60;
      const localDate = new Date(today.getTime() + localOffsetInSeconds * 1000);

      const formattedDate = localDate.toLocaleString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });

      setDate(formattedDate);
    };

    updateTime();

    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, [weather]);

  return <p>{date}</p>;
};

export default DateTime;
