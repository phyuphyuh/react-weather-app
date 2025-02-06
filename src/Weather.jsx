import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Weather = () => {
  const [city, setCity] = useState('Bangkok');
  const [weather, setWeather] = useState(null);
  const [date, setDate] = useState('');

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        setWeather(response.data);
      } catch (error) {
        console.error(error);
        setWeather(null);
      }
    };
    fetchWeather();
  }, [city]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
      setDate(formattedDate);
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  return (
    <div>
      <h1>Weather App</h1>
      <input type="text" value={city} onChange={handleCityChange} placeholder='Enter city name' />
      {weather && (
        <div>
          <h2>Weather in {weather.name}</h2>
          <p>{date}</p>
          <p>{weather.weather[0].description}</p>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind Speed: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
