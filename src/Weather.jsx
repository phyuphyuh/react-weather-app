import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherIcon from './WeatherIcon';
import DateTime from './DateTime';
import './Weather.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [timeOfDay, setTimeOfDay] = useState('');
  const [unitSystem, setUnitSystem] = useState('metric');

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
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${unitSystem}`);
      setWeather(response.data);
    } catch (error) {
      console.error(error);
      setWeather(null);
    }
  };

  const fetchWeatherByLocation = async (latitude, longitude, unitSystem) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unitSystem}`);
      setWeather(response.data);
    } catch (error) {
      console.error(error);
      setWeather(null);
    }
  };

  const handleUnitSystemChange = () => {
    setUnitSystem(unitSystem === 'metric' ? 'imperial' : 'metric');
    if (city) {
      fetchWeatherByCity(city, unitSystem === 'metric' ? 'imperial' : 'metric');
    } else if (lat && lon) {
      fetchWeatherByLocation(lat, lon, unitSystem === 'metric' ? 'imperial' : 'metric');
    }
  };

  const temperatureUnit = unitSystem === 'metric' ? '°C' : '°F';
  const windSpeedUnit = unitSystem === 'metric' ? 'm/s' : 'mph';

  const condition = weather ? weather.weather[0].main : '';
  const iconCode = weather ? weather.weather[0].icon : '';

  return (
    <div className={`weather-container ${timeOfDay} h-dvh w-full absolute top-0`}>
      <form
          onSubmit={handleSubmit}
          className='bg-white-100 p-1 rounded-full shadow-md my-8 mx-4 flex'
      >
        <input
            type="text"
            value={city}
            onChange={handleCityChange}
            placeholder='Enter city name'
            className="p-2 w-64 flex-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white/50 backdrop-invert backdrop-opacity-10"
        />
        <button
            onClick={handleGetLocation}
            className='text-sky-400 hover:text-sky-300 cursor-pointer mx-4 text-md'
        >
          <FontAwesomeIcon icon={faLocationArrow} />
        </button>
        <button
            type='submit'
            className='w-10 flex-none cursor-pointer rounded-4xl bg-sky-400 hover:bg-sky-300 text-white text-sm'
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </form>

      <button onClick={handleUnitSystemChange} className='text-sm cursor-pointer'>
        {unitSystem === 'metric' ? 'Switch to Imperial' : 'Switch to Metric'}
      </button>

      {weather ? (
        <div className='m-8'>
          <h3 className='text-2xl font-medium'>{weather.name}</h3>
          <WeatherIcon condition={condition} iconCode={iconCode} />
          <h2 className='text-3xl font-semibold'>{weather.main.temp}{temperatureUnit}</h2>
          <p>{weather.weather[0].description}</p>
          <DateTime weather={weather} setTimeOfDay={setTimeOfDay} />
          <div className='grid grid-cols-2 gap-4 mt-4'>
            <div>
              <i className='wi wi-thermometer'></i>
              <p>Feels Like: {weather.main.feels_like}{temperatureUnit}</p>
            </div>
            <div>
              <i className='wi wi-humidity'></i>
              <p>Humidity: {weather.main.humidity}%</p>
            </div>
            <div>
              <i className='wi wi-strong-wind'></i>
              <p>Wind Speed: {weather.wind.speed} {windSpeedUnit}</p>
            </div>
            <div>
              <i className='wi wi-raindrop'></i>
              <p>Precipitation: {weather.rain && weather.rain['1h']} mm/hr</p>
            </div>
          </div>
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
