import React, { useState, useEffect } from 'react';

const DateTime = ({ weather, setTimeOfDay }) => {
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

      const hour = localDate.getHours();
      const isDaytime = hour >= 6 && hour < 15;
      const isEvening = hour >= 15 && hour < 19;
      const isNight = hour >= 19 || hour < 6;
      if (isDaytime) {
        setTimeOfDay('daytime');
      } else if (isEvening) {
        setTimeOfDay('evening');
      } else if (isNight) {
        setTimeOfDay('night');
      }
    };

    updateTime();

    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, [weather, setTimeOfDay]);

  return <p className='mt-6 mb-9 md:my-3 text-md font-light text-white'>{date}</p>;
};

export default DateTime;
