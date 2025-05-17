// Controllers/notifications.js
import express from "express";
import { checkSeasonAlerts } from "../Services/seasonAlert.js";
import { getWeatherAlerts } from "../Services/weatherAlert.js";

const router = express.Router();

router.get("/api/notifications", async (req, res) => {
  try {
    // 1. Season alerts
    const seasonAlerts = checkSeasonAlerts(); 
    const notifications = seasonAlerts.map((season) => ({
      type: "season",
      message: `Season alert: ${season.crop} is in its growing window (${season.start}–${season.end}).`
    }));

    // 2. Weather alert
    const weatherMsg = await getWeatherAlerts();
    notifications.push({
      type: "weather",
      message: weatherMsg
    });

    // 3. Return combined notifications
    return res.json({ notifications });
  } catch (error) {
    console.error("Error getting notifications:", error);
    return res.status(500).json({ error: "Failed to get notifications." });
  }
});

export default router;
