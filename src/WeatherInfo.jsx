import React from "react";
import WeatherIcon from './WeatherIcon';

const WeatherInfo = ({ weather, temperatureUnit, windSpeedUnit, formatTime }) => {
  const condition = weather ? weather.weather[0].main : '';
  const iconCode = weather ? weather.weather[0].icon : '';

  return (
    <div className='m-4 p-4 md:m-6 md:p-6 bg-white/20 backdrop-invert backdrop-opacity-6 rounded-xl'>
      <h3 className='text-2xl font-normal text-white mb-1'>{weather.name}</h3>
      <h2 className='text-5xl font-light text-white'>{Math.round(weather.main.temp)}{temperatureUnit}</h2>

      <WeatherIcon condition={condition} iconCode={iconCode} />

      <p className='text-lg font-medium text-sky-100 opacity-70'>{weather.weather[0].description}</p>
      <p className='text-lg font-medium text-sky-100'><span>H:{Math.round(weather.main.temp_max)}{temperatureUnit}</span><span className='ms-3'>L:{Math.round(weather.main.temp_min)}{temperatureUnit}</span></p>

      <div className='grid grid-cols-3 gap-2 mt-4'>
        <div className='flex flex-col justify-around p-3 bg-white/20 backdrop-invert backdrop-opacity-5 rounded-xl'>
          <div className="flex items-center justify-center">
            <i className='wi wi-thermometer text-white text-lg opacity-80'></i>
            <span className='ms-2 text-sm font-bold text-white opacity-70'>FEELS LIKE</span>
          </div>
          <p className='text-white text-xl'>{Math.round(weather.main.feels_like)}{temperatureUnit}</p>
        </div>
        <div className='flex flex-col justify-around p-3 bg-white/20 backdrop-invert backdrop-opacity-5 rounded-xl'>
          <div className="flex items-center justify-center">
            <i className='wi wi-humidity text-white text-lg opacity-80'></i>
            <span className='ms-2 text-sm font-bold text-white opacity-70'>HUMIDITY</span>
          </div>
          <p className='text-white text-xl'>{weather.main.humidity}%</p>
        </div>
        <div className='row-span-2 p-3 bg-white/20 backdrop-invert backdrop-opacity-5 rounded-xl flex flex-col justify-center'>
          <i className='wi wi-sunrise text-white text-xl opacity-80'></i>
          <p className='text-white text-base'>Sunrise: {formatTime(weather.sys.sunrise)}</p>
          <i className='wi wi-sunset text-white text-xl opacity-80 mt-3'></i>
          <p className='text-white text-base'>Sunset: {formatTime(weather.sys.sunset)}</p>
        </div>
        <div className='flex flex-col justify-around p-3 bg-white/20 backdrop-invert backdrop-opacity-5 rounded-xl'>
          <div className="flex items-center justify-center">
            <i className='wi wi-strong-wind text-white text-lg opacity-80'></i>
            <span className='ms-2 text-sm font-bold text-white opacity-70'>WIND SPEED</span>
          </div>
          <p className='text-white text-xl'>{weather.wind.speed} {windSpeedUnit}</p>
        </div>
        <div className='flex flex-col justify-around p-3 bg-white/20 backdrop-invert backdrop-opacity-5 rounded-xl'>
          <div className="flex flex-wrap justify-center">
            <i className='wi wi-raindrop text-white text-lg opacity-80'></i>
            <span className='ms-2 text-xs font-bold text-white opacity-70'>PRECIPITATION</span>
          </div>
          <p className='text-white text-xl'>{weather.rain && weather.rain['1h']} mm/hr</p>
        </div>
      </div>

    </div>
  );
};

export default WeatherInfo;
