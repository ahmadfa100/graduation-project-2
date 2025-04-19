// backend/routes/notifications.js
import express from "express";
import { getWeatherAlerts }   from "../Services/weatherAlert.js";
import { checkSeasonAlerts }   from "../Services/seasonAlert.js";
const router = express.Router();

router.get("/api/notifications", async (req, res) => {
  try {
    // Build season alerts
    const seasonAlerts = checkSeasonAlerts().map(season => ({
      message: `Season alert: ${season.crop} is in its growing window (${season.start}–${season.end}).`
    }));

    // Fetch weather alert
    const weatherMsg = await getWeatherAlerts();
    const weatherAlert = { message: weatherMsg };

    // Return combined notifications array
    res.json({
      notifications: [
        ...seasonAlerts,
        weatherAlert
      ]
    });
  } catch (err) {
    console.error("Notifications error:", err);
    res.status(500).json({ error: "Failed to get notifications." });
  }
});

export default router;
