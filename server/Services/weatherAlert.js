// backend/services/weatherService.js

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const API_KEY = process.env.Weather_API_Key || "";

function alertMessage(alertType, forecastday) {
  const { date, day } = forecastday;
  switch (alertType) {
    case "snow":
      return `A snow possibility alert has been issued for ${date}. There is a chance of snowfall, which could impact farm operations.`;
    case "hot":
      return `A high-temperature warning for ${date}. Temperatures up to ${day.maxtemp_c}°C. This can pose risks to crops and livestock.`;
    case "cold":
      return `A cold weather warning for ${date}. Temperatures may drop to ${day.mintemp_c}°C. Protect crops and livestock.`;
    case "windy":
      return `A strong wind warning for ${date}. Wind speeds up to ${day.maxwind_kph} km/h. Potential damage to crops.`;
    case "hotwindy":
      return `High-temp + strong wind warning for ${date}. Up to ${day.maxtemp_c}°C and ${day.maxwind_kph} km/h winds.`;
    case "coldwindy":
      return `Cold + strong wind warning for ${date}. Down to ${day.mintemp_c}°C and winds up to ${day.maxwind_kph} km/h.`;
    default:
      return "No severe weather alerts. Conditions are normal.";
  }
}

export async function getWeatherAlerts(location = "irbid", days = 8) {
  try {
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=${days}`;
    const response = await axios.get(url);

    // pick a day, e.g. 7th
    const forecastday = response.data.forecast.forecastday[7];
    if (!forecastday) {
      return "Weather data is unavailable for the selected day.";
    }

    let alerts = [];
    if (forecastday.day.maxtemp_c >= 40) alerts.push("hot");
    if (forecastday.day.mintemp_c <= 0) alerts.push("cold");
    if (forecastday.day.maxwind_kph >= 40) alerts.push("windy");
    if (forecastday.day.daily_chance_of_snow > 0) alerts = ["snow"];

    let alertType = alerts.join("");
    return alertMessage(alertType, forecastday);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw new Error("Failed to fetch weather data.");
  }
}
