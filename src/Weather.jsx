import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherIcon from './WeatherIcon';
import DateTime from './DateTime';
import './Weather.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const CACHE_EXPIRATION = 30 * 60 * 1000;

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

  const condition = weather ? weather.weather[0].main : '';
  const iconCode = weather ? weather.weather[0].icon : '';

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className={`weather-container ${timeOfDay} h-dvh w-full absolute top-0`}>
      <form
          onSubmit={handleSubmit}
          className='bg-white-100 p-1 rounded-full shadow-md mt-8 mb-6 mx-4 flex'
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

      <button onClick={handleUnitSystemChange} className='text-sm text-white cursor-pointer hover:text-sky-100'>
        {unitSystem === 'metric' ? 'Switch to Imperial' : 'Switch to Metric'}
      </button>

      {weather ? (
        <div className='m-6 p-6 bg-white/20 backdrop-invert backdrop-opacity-6 rounded-xl'>
          <h3 className='text-2xl font-normal text-white mb-1'>{weather.name}</h3>
          <h2 className='text-5xl font-light text-white'>{Math.round(weather.main.temp)}{temperatureUnit}</h2>

          <WeatherIcon condition={condition} iconCode={iconCode} />

          <p className='text-lg font-medium text-sky-100 opacity-60'>{weather.weather[0].description}</p>
          <p className='text-lg font-medium text-sky-100'><span>H:{Math.round(weather.main.temp_max)}{temperatureUnit}</span><span className='ms-3'>L:{Math.round(weather.main.temp_min)}{temperatureUnit}</span></p>

          <DateTime weather={weather} setTimeOfDay={setTimeOfDay} />

          <div className='grid grid-cols-3 gap-2 mt-4'>
            <div className='p-3 bg-white/20 backdrop-invert backdrop-opacity-5 rounded-xl'>
              <i className='wi wi-thermometer text-white text-lg opacity-80'></i><span className='ms-2 text-sm font-bold text-white opacity-70'>FEELS LIKE</span>
              <p className='text-white text-2xl'>{weather.main.feels_like}{temperatureUnit}</p>
            </div>
            <div className='p-3 bg-white/20 backdrop-invert backdrop-opacity-5 rounded-xl'>
              <i className='wi wi-humidity text-white text-lg opacity-80'></i><span className='ms-2 text-sm font-bold text-white opacity-70'>HUMIDITY</span>
              <p className='text-white text-2xl'>{weather.main.humidity}%</p>
            </div>
            <div className='row-span-2 p-3 bg-white/20 backdrop-invert backdrop-opacity-5 rounded-xl flex flex-col justify-center'>
              <i className='wi wi-sunrise text-white text-xl opacity-80'></i>
              <p className='text-white text-base'>Sunrise: {formatTime(weather.sys.sunrise)}</p>
              <i className='wi wi-sunset text-white text-xl opacity-80 mt-3'></i>
              <p className='text-white text-base'>Sunset: {formatTime(weather.sys.sunset)}</p>
            </div>
            <div className='p-3 bg-white/20 backdrop-invert backdrop-opacity-5 rounded-xl'>
              <i className='wi wi-strong-wind text-white text-lg opacity-80'></i><span className='ms-2 text-sm font-bold text-white opacity-70'>WIND SPEED</span>
              <p className='text-white text-2xl'>{weather.wind.speed} {windSpeedUnit}</p>
            </div>
            <div className='p-3 bg-white/20 backdrop-invert backdrop-opacity-5 rounded-xl'>
              <i className='wi wi-raindrop text-white text-lg opacity-80'></i><span className='ms-2 text-sm font-bold text-white opacity-70'>PRECIPITATION</span>
              <p className='text-white text-2xl'>{weather.rain && weather.rain['1h']} mm/hr</p>
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
