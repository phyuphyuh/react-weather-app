import React from "react";

const weatherIcons = {
  "Clear": {
    day: "wi-day-sunny text-yellow-300",
    night: "wi-stars"
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
    day: "wi-day-sprinkle",
    night: "wi-night-alt-sprinkle"
  },
  "Rain": {
    day: "wi-day-rain",
    night: "wi-night-alt-rain"
  },
  "Snow": {
    day: "wi-day-snow",
    night: "wi-night-alt-snow"
  },
  "Mist": {
    day: "wi-day-cloudy-windy",
    night: "wi-night-alt-cloudy-windy"
  },
  "Smoke": {
    day: "wi-smoke",
    night: "wi-smoke"
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
    <i className={`wi ${iconClass} text-6xl mt-5 mb-2`}></i>
  );
};

export default WeatherIcon;
