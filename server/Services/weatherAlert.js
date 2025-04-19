import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const API_KEY = process.env.WEATHER_API_KEY;
if (!API_KEY) {
  throw new Error("Missing WEATHER_API_KEY in your environment");
}

function alertMessage(alertType, forecastday) {
  const { date, day } = forecastday;
  switch (alertType) {
    case "snow":
      return `A snow possibility alert has been issued for ${date}. There is a chance of snowfall.`;
    case "hot":
      return `High-temperature warning for ${date}: up to ${day.maxtemp_c}°C.`;
    case "cold":
      return `Cold-weather warning for ${date}: down to ${day.mintemp_c}°C.`;
    case "windy":
      return `Strong wind warning for ${date}: winds up to ${day.maxwind_kph} km/h.`;
    case "hotwindy":
      return `High-temp + wind warning for ${date}: ${day.maxtemp_c}°C & ${day.maxwind_kph} km/h.`;
    case "coldwindy":
      return `Cold + wind warning for ${date}: ${day.mintemp_c}°C & ${day.maxwind_kph} km/h.`;
    default:
      return "No severe weather alerts. Conditions are normal.";
  }
}

export async function getWeatherAlerts(location = "irbid", days = 3) {
  try {
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=${days}`;
    const { data } = await axios.get(url);
    const list = data.forecast?.forecastday;
    if (!Array.isArray(list) || list.length === 0) {
      return "Weather data is unavailable for the selected day.";
    }
    const forecastday = list[list.length - 1];
    let alerts = [];
    if (forecastday.day.maxtemp_c >= 40)        alerts.push("hot");
    if (forecastday.day.mintemp_c <= 0)          alerts.push("cold");
    if (forecastday.day.maxwind_kph >= 40)       alerts.push("windy");
    if (forecastday.day.daily_chance_of_snow > 0) alerts = ["snow"];
    const type = alerts.join("");
    return alertMessage(type, forecastday);
  } catch (err) {
    console.error(err);
    return "Weather data is unavailable for the selected day.";
  }
}