import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const OWM_KEY = process.env.OWM_API_KEY;
if (!OWM_KEY) throw new Error("Missing OWM_API_KEY");

export async function getWeatherAlertsOWM(lat = 31.95, lon = 35.91) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${OWM_KEY}&exclude=current,minutely,hourly,daily`;
    const { data } = await axios.get(url);

    if (data.alerts && data.alerts.length > 0) {
      return data.alerts
        .map(a => {
          const start = new Date(a.start * 1000).toLocaleString();
          return `⚠️ ${a.event} (from ${start})\n${a.description}`;
        })
        .join("\n\n");
    }
    return "No severe weather alerts. Conditions are normal.";
  } catch (err) {
    console.error("OWM fetch error:", err);
    return "Weather data is unavailable at this time.";
  }
}
