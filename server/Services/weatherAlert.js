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
      return null;  // no alert for this day
  }
}

/**
 * Fetch weather alerts; checks official alerts first, then per-day thresholds.
 */
export async function getWeatherAlerts(location = "irbid", days = 3) {
  try {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=${days}&alerts=yes`;
    const { data } = await axios.get(url);

    // 1. Official alerts
    const apiAlerts = data.alerts?.alert;
    if (Array.isArray(apiAlerts) && apiAlerts.length > 0) {
      const msgs = apiAlerts.map(a => `${a.headline}: ${a.msg || a.desc || ''}`.trim());
      return msgs.join("\n");
    }

    // 2. Custom per-day checks
    const daysList = data.forecast?.forecastday;
    if (!Array.isArray(daysList) || daysList.length === 0) {
      return "Weather data is unavailable for the selected day.";
    }

    const messages = [];
    for (const fd of daysList) {
      const alerts = [];
      if (fd.day.maxtemp_c >= 40) alerts.push("hot");
      if (fd.day.mintemp_c <= 0) alerts.push("cold");
      if (fd.day.maxwind_kph >= 40) alerts.push("windy");
      const chance = Number(fd.day.daily_chance_of_snow);
      if (!isNaN(chance) && chance > 0) {
        alerts.length = 0;
        alerts.push("snow");
      }
      const type = alerts.join("");
      const msg = alertMessage(type, fd);
      if (msg) messages.push(msg);
    }

    if (messages.length > 0) {
      return messages.join("\n");
    }

    // 3. No alerts
    return "No severe weather alerts. Conditions are normal.";
  } catch (err) {
    console.error("Error fetching weather:", err);
    return "Weather data is unavailable for the selected day.";
  }
}
