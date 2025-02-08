import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const WeatherForm = ({ city, handleCityChange, handleSubmit, handleGetLocation, unitSystem, handleUnitSystemChange }) => {
  return (
    <>
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
    </>
  );
};

export default WeatherForm;
