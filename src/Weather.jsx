import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherForm from './WeatherForm';
import WeatherInfo from './WeatherInfo';
import DateTime from './DateTime';
import './Weather.css';

const CACHE_EXPIRATION = 30 * 60 * 1000;

const Weather = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [timeOfDay, setTimeOfDay] = useState('');
  const [unitSystem, setUnitSystem] = useState('metric');

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
      },
      (error) => {
        console.error('Error getting location:', error);
        setCity('Bangkok');
      }
    );
  }, []);

  useEffect(() => {
    if (lat && lon) {
      fetchWeatherByLocation(lat, lon, unitSystem);
    }
  }, [lat, lon, unitSystem]);

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

  const handleCityChange = (event) => {
    setCity(event.target.value);
    setLat(null);
    setLon(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (city) {
      fetchWeatherByCity(city, unitSystem);
    }
  };

  const fetchWeatherByCity = async (cityName, unitSystem) => {
    const cacheKey = `${cityName}-${unitSystem}`;
    const cachedData = JSON.parse(localStorage.getItem(cacheKey));

    if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRATION) {
      console.log('Using cached city data:', cityName);
      setWeather(cachedData.weather);
      return;
    }

    try {
      console.log('Fetching new data for:', cityName);
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${unitSystem}`);
      localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), weather: response.data }));
      setWeather(response.data);
    } catch (error) {
      console.error(error);
      setWeather(null);
    }
  };

  const fetchWeatherByLocation = async (latitude, longitude, unitSystem) => {
    const cacheKey = `${latitude}-${longitude}-${unitSystem}`;
    const cachedData = JSON.parse(localStorage.getItem(cacheKey));

    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_EXPIRATION)) {
      console.log('Using cached location data:', latitude, longitude);
      setWeather(cachedData.weather);
      return;
    }

    try {
      console.log('Fetching new data for:', latitude, longitude);
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unitSystem}`);
      localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), weather: response.data }));
      setWeather(response.data);
    } catch (error) {
      console.error(error);
      setWeather(null);
    }
  };

  const handleUnitSystemChange = () => {
    const newUnit = unitSystem === 'metric' ? 'imperial' : 'metric';
    setUnitSystem(newUnit);

    if (city) {
      fetchWeatherByCity(city, newUnit);
    } else if (lat && lon) {
      fetchWeatherByLocation(lat, lon, newUnit);
    }
  };

  const temperatureUnit = unitSystem === 'metric' ? '°C' : '°F';
  const windSpeedUnit = unitSystem === 'metric' ? 'm/s' : 'mph';

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className={`weather-container ${timeOfDay} h-dvh w-full absolute top-0`}>
      <WeatherForm
        city={city}
        handleCityChange={handleCityChange}
        handleSubmit={handleSubmit}
        handleGetLocation={handleGetLocation}
        unitSystem={unitSystem}
        handleUnitSystemChange={handleUnitSystemChange}
      />

      {weather ? (
        <>
          <DateTime weather={weather} setTimeOfDay={setTimeOfDay} />

          <WeatherInfo
            weather={weather}
            temperatureUnit={temperatureUnit}
            windSpeedUnit={windSpeedUnit}
            formatTime={formatTime}
          />
        </>
      ) : lat || lon || city ? (
        <p>Loading...</p>
      ) : (
        <p>Enter a city or use your current location to get the weather.</p>
      )}
    </div>
  );
};

export default Weather;
