import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.WEATHERBIT_API_KEY;
if (!API_KEY) throw new Error("Missing WEATHERBIT_API_KEY in your environment");


export async function getWeatherAlertsWB(lat = 31.95, lon = 35.91) {
  try {
    const url = `https://api.weatherbit.io/v2.0/alerts?lat=${lat}&lon=${lon}&key=${API_KEY}`;
    const { data } = await axios.get(url);

    if (Array.isArray(data.alerts) && data.alerts.length > 0) {
      return data.alerts
        .map(a => {
          const start = new Date(a.effective).toLocaleString();
          return `⚠️ ${a.event} (Effective: ${start})\n${a.description}`;
        })
        .join("\n\n");
    }

    return "No severe weather alerts. Conditions are normal.";
  } catch (err) {
    console.error("Weatherbit fetch error:", err);
    return "Weather data is unavailable at this time.";
  }
}
