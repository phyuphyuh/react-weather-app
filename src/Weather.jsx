import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [date, setDate] = useState('');
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       setLat(position.coords.latitude);
  //       setLon(position.coords.longitude);
  //     },
  //     (error) => {
  //       console.error('Error getting location:', error);
  //       setCity('Bangkok');
  //     }
  //   );
  // }, []);

  useEffect(() => {
    if (lat && lon) {
      fetchWeatherByLocation(lat, lon);
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
    if (city) {
      fetchWeatherByCity(city);
    }
  };

  const fetchWeatherByCity = async (cityName) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`);
      setWeather(response.data);
    } catch (error) {
      console.error(error);
      setWeather(null);
    }
  };

  const fetchWeatherByLocation = async (latitude, longitude) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
      setWeather(response.data);
    } catch (error) {
      console.error(error);
      setWeather(null);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Weather App</h1>
      <form
          onSubmit={handleSubmit}
          className='bg-white-100 p-1 rounded-lg shadow-md mb-4 flex divide-x divide-blue-200'
      >
        <input
            type="text"
            value={city}
            onChange={handleCityChange}
            placeholder='Enter city name'
            className="p-2 w-64 flex-1"
        />
        <button
            type='submit'
            className='w-32 flex-none cursor-pointer hover:text-sky-500'
        >
          Get Weather
        </button>
      </form>
      <button
          onClick={handleGetLocation}
          className='bg-blue-500 hover:bg-blue-600'
      >
      </button>
      {weather ? (
        <div>
          <h2>Weather in {weather.name}</h2>
          <p>{date}</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
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
