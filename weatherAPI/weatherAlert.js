import express from "express";
import axios from "axios";

const port = 3000;
const app = express();


app.get("/", async (req, res) => {
  let alertType = "";
  const response = await axios.get(
    "http://api.weatherapi.com/v1/forecast.json?key=7b3f24d93ce9469fb85113102251402&q=irbid&days=8"
  );
  let forecastday = response.data.forecast.forecastday[7];
  console.log("here :" + forecastday.day.maxtemp_c);
  if (forecastday.day.maxtemp_c >= 40) {
    alertType += "hot";
  }
  if (forecastday.day.mintemp_c <= 0) {
    alertType += "cold";
  }
  if (forecastday.day.maxwind_kph >= 40) {
    alertType += "windy";
  }
  if(forecastday.day.daily_chance_of_snow >0){

    alertType= "snow";
  }
  // still we need for snow and frost
  // sent email

  // console.log("here snow : "+ forecastday.day.daily_chance_of_snow);
  // console.log(alertType + "\n");
  // console.log(alertMessage(alertType, forecastday));
  res.send(alertMessage(alertType, forecastday));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
function alertMessage(alertType, forecastday) {
  switch (alertType) {
    case "snow":
      return `A snow possibility alert has been issued for your area. There is a chance of snowfall on ${forecastday.date}, which could impact farm operations, crops, and livestock. While the exact amount of snow is uncertain, it is important to prepare for potential disruptions.`;
    case "hot":
      return `A high-temperature warning has been issued for your area. On ${forecastday.date},
     temperatures are expected to soar up to ${forecastday.day.maxtemp_c}. This extreme heat can pose risks to crops, 
     livestock, and farm operations.`;
    case "cold":
      return `A cold weather warning has been issued for your area. on ${forecastday.date} Temperatures are expected to drop significantly,
       with lows reaching ${forecastday.day.maxtemp_c}. This cold snap can affect crops, livestock, and farm operations.`;
    case "windy":
      return `A strong wind warning has been issued for your area.on ${forecastday.day.maxtemp_c} Wind speeds are expected to reach up to ${forecastday.day.maxwind_kph} km/h, which may cause damage to crops, structures, and equipment. High winds can also increase the risk of soil erosion and fire hazards`;
    case "hotwindy":
      return `A high-temperature warning with strong winds has been issued for your area. On ${forecastday.date},
       temperatures are expected to reach up to${forecastday.day.maxtemp_c}, accompanied by winds of ${forecastday.day.maxwind_kph} km/h. This combination can increase the risk of heat stress, rapid evaporation, and fire hazards`;
    case "coldwindy":
      return `A cold weather warning with strong winds has been issued for your area. on ${forecastday.date} Temperatures are expected to 
      drop to ${forecastday.day.maxtemp_c}, with wind speeds of ${forecastday.day.maxwind_kph} km/h, creating dangerous wind chill 
      conditions. This combination can increase the risk of frostbite, hypothermia, and damage to crops and 
      livestock`;
    default:
      return "normal weather";
  }
}

