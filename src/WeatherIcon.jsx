import React from "react";

const weatherIcons = {
  "Clear": {
    day: "wi-day-sunny text-yellow-300",
    night: "wi-stars text-amber-200"
  },
  "Clouds": {
    day: "wi-day-cloudy text-neutral-300",
    night: "wi-night-alt-cloudy text-slate-300"
  },
  "Thunderstorm": {
    day: "wi-day-thunderstorm text-zinc-400",
    night: "wi-night-alt-thunderstorm text-gray-400"
  },
  "Drizzle": {
    day: "wi-day-sprinkle text-neutral-300",
    night: "wi-night-alt-sprinkle text-gray-300"
  },
  "Rain": {
    day: "wi-day-rain text-neutral-300",
    night: "wi-night-alt-rain text-gray-300"
  },
  "Snow": {
    day: "wi-day-snow text-sky-50",
    night: "wi-night-alt-snow text-slate-50"
  },
  "Mist": {
    day: "wi-day-cloudy-windy text-blue-50",
    night: "wi-night-alt-cloudy-windy text-blue-50"
  },
  "Smoke": {
    day: "wi-smoke text-gray-400",
    night: "wi-smoke text-gray-400"
  },
  "Haze": {
    day: "wi-day-haze",
    night: "wi-fog"
  },
  "Dust": {
    day: "wi-dust",
    night: "wi-dust"
  },
  "Fog": {
    day: "wi-day-fog",
    night: "wi-night-fog"
  },
  "Sand": {
    day: "wi-sandstorm",
    night: "wi-sandstorm"
  },
  "Ash": {
    day: "wi-volcano",
    night: "wi-volcano"
  },
  "Squall": {
    day: "wi-strong-wind",
    night: "wi-strong-wind"
  },
  "Tornado": {
    day: "wi-tornado",
    night: "wi-tornado"
  }
}

const WeatherIcon = ({ condition, iconCode }) => {
  const isDay = iconCode.endsWith("d");
  const iconClass = weatherIcons[condition] ? weatherIcons[condition][isDay ? "day" : "night"] : "win-na";

  return (
    <i className={`wi ${iconClass} text-7xl mt-4 mb-3`}></i>
  );
};

export default WeatherIcon;
