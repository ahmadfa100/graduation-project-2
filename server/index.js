import express from "express";
import cors from "cors";
import env from "dotenv";
import multer from "multer";

// Import controllers
import {
  getOffer,
  addOffer,
  updateOffer,
  deleteOffer,
  getAllOffers,
} from "./Controllers/offer.js";
import { getNotifications } from "./Controllers/notification.js";

env.config();
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Offers endpoints
app.get("/getOffer/:offerID", getOffer);
app.post("/addOffer", upload.array("images", 10), addOffer);
app.put("/updateOffer/:offerID", upload.array("images", 10), updateOffer);
app.delete("/deleteOffer/:offerID", deleteOffer);
app.get("/offers", getAllOffers);

// Notifications endpoint
app.get("/api/notifications", getNotifications);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
