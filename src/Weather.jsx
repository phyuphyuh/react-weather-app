import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Weather = () => {
  const [city, setCity] = useState('Bangkok');
  const [weather, setWeather] = useState(null);
  const [date, setDate] = useState('');
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    fetchWeather();
  }, []);

  useEffect(() => {
    if (lat && lon) {
      fetchWeather();
    }
  }, [lat, lon]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleString('en-US', {
        weekday: 'long',
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
    setLat(null);
    setLon(null);
  };

  const handleGetLocation = () => {
    setCity('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchWeather();
  };

  const fetchWeather = async () => {
    if (city) {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        setWeather(response.data);
      } catch (error) {
        console.error(error);
        setWeather(null);
      }
    } else if (lat && lon) {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        setWeather(response.data);
      } catch (error) {
        console.error(error);
        setWeather(null);
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Weather App</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={city} onChange={handleCityChange} placeholder='Enter city name' />
        <button type='submit'>Get Weather</button>
      </form>
      <button onClick={handleGetLocation}>Current Location</button>
      {weather ? (
        <div>
          <h2>Weather in {weather.name}</h2>
          <p>{date}</p>
          <p>{weather.weather[0].description}</p>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind Speed: {weather.wind.speed} m/s</p>
        </div>
      ) : lat || lon || city ? (
        <p>Loading...</p>
      ) : (
        <p>Enter a city or use your current location to get the weather.</p>
      )}
    </div>
  );
};

export default Weather;
