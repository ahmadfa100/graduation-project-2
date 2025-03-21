import express from "express";
import axios from "axios";
import env from "dotenv";
env.config();
const port = 3005;
const app = express();
const API_key=process.env.Weather_API_Key;
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      `http://api.weatherapi.com/v1/forecast.json?key=${API_key}&q=irbid&days=8`
    );

    const forecastday = response.data.forecast.forecastday[7];

    if (!forecastday) {
      return res.send("Weather data is unavailable for the selected day.");
    }

    let alerts = [];
    if (forecastday.day.maxtemp_c >= 40) alerts.push("hot");
    if (forecastday.day.mintemp_c <= 0) alerts.push("cold");
    if (forecastday.day.maxwind_kph >= 40) alerts.push("windy");
    if (forecastday.day.daily_chance_of_snow > 0) alerts = ["snow"]; 

    let alertType = alerts.join("");

    res.send(alertMessage(alertType, forecastday));
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).send("Failed to fetch weather data.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function alertMessage(alertType, forecastday) {
  const { date, day } = forecastday;
  switch (alertType) {
    case "snow":
      return `A snow possibility alert has been issued for your area. There is a chance of snowfall on ${date}, which could impact farm operations, crops, and livestock. Prepare for potential disruptions.`;
    case "hot":
      return `A high-temperature warning has been issued for your area. On ${date}, temperatures are expected to soar up to ${day.maxtemp_c}°C. This extreme heat can pose risks to crops, livestock, and farm operations.`;
    case "cold":
      return `A cold weather warning has been issued for your area. On ${date}, temperatures may drop as low as ${day.mintemp_c}°C, affecting crops, livestock, and farm operations.`;
    case "windy":
      return `A strong wind warning has been issued for your area. On ${date}, wind speeds may reach up to ${day.maxwind_kph} km/h, potentially damaging crops, structures, and equipment.`;
    case "hotwindy":
      return `A high-temperature warning with strong winds has been issued for your area. On ${date}, temperatures may reach ${day.maxtemp_c}°C with winds of ${day.maxwind_kph} km/h, increasing risks of heat stress, rapid evaporation, and fire hazards.`;
    case "coldwindy":
      return `A cold weather warning with strong winds has been issued for your area. On ${date}, temperatures may drop to ${day.mintemp_c}°C with winds of ${day.maxwind_kph} km/h, creating dangerous wind chill conditions and potential damage to crops and livestock.`;
    default:
      return "No severe weather alerts. Conditions are normal.";
  }
}
