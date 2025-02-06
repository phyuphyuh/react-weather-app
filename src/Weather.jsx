import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Weather = () => {
  const [city, setCity] = useState('Bangkok');
  const [weather, setWeather] = useState(null);
  const [date, setDate] = useState('');
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [locationWeather, setLocationWeather] = useState(null);

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    const fetchWeatherByCity = async () => {
      if (city) {
        try {
          const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
          setWeather(response.data);
        } catch (error) {
          console.error(error);
          setWeather(null);
        }
      }
    };
    fetchWeatherByCity();
  }, [city]);

  useEffect(() => {
    const fetchWeatherByLocation = async () => {
      if (lat && lon) {
        try {
          const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
          setLocationWeather(response.data);
        } catch (error) {
          console.error(error);
          setLocationWeather(null);
        }
      }
    };
    fetchWeatherByLocation();
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
  };

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLat(position.coords.latitude);
      setLon(position.coords.longitude);
    });
  };

  return (
    <div>
      <h1>Weather App</h1>
      <input type="text" value={city} onChange={handleCityChange} placeholder='Enter city name' />
      <button onClick={handleGetLocation}>Current Location</button>
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
      {locationWeather && (
        <div>
          <h2>Weather in your current location</h2>
          <p>{date}</p>
          <p>{locationWeather.weather[0].description}</p>
          <p>Temperature: {locationWeather.main.temp}°C</p>
          <p>Humidity: {locationWeather.main.humidity}%</p>
          <p>Wind Speed: {locationWeather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
