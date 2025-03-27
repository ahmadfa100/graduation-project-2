
import { checkSeasonAlerts } from "../Services/seasonAlert.js";
import { getWeatherAlerts } from "../Services/weatherAlert.js";

export async function getNotifications(req, res) {
  try {
    const seasonAlerts = checkSeasonAlerts(); 

    const weatherAlertMessage = await getWeatherAlerts();

    const notifications = [];

    // Season notifications
    if (seasonAlerts.length > 0) {
      seasonAlerts.forEach((season) => {
        notifications.push({
          type: "season",
          message: `It's planting time for ${season.crop}! (Month: ${season.start})`,
        });
      });
    }

    // Weather notification
    notifications.push({
      type: "weather",
      message: weatherAlertMessage,
    });

    // * Return JSON
    return res.json({ notifications });
  } catch (error) {
    console.error("Error getting notifications:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}