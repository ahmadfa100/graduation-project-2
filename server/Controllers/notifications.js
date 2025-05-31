import express from "express";
import { checkSeasonAlerts } from "../Services/seasonAlert.js";
import { getWeatherAlertsWB  } from "../Services/weatherAlertsWeatherbit.js";
const router = express.Router();

router.get("/api/notifications", async (req, res) => {
  try {
    const seasonAlerts = checkSeasonAlerts(); 
    const notifications = seasonAlerts.map((season) => ({
      type: "season",
      message: `Season alert: ${season.crop} is in its growing window (${season.start}–${season.end}).`
    }));

    const weatherMsg = await getWeatherAlertsWB();
    notifications.push({
      type: "weather",
      message: weatherMsg
    });

    return res.json({ notifications });
  } catch (error) {
    console.error("Error getting notifications:", error);
    return res.status(500).json({ error: "Failed to get notifications." });
  }
});

export default router;
