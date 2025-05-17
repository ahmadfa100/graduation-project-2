import express from "express";
import cors from "cors";
import env from "dotenv";
import multer from "multer";
import { createServer } from "http";
import { Server } from "socket.io";
import session from "express-session";
import db from "./db.js";
import notificationsRouter  from "./Controllers/notifications.js";
import { getCurrentLands } from "./Controllers/farmerLands.js";

import {
  getRequests,
  acceptRequest,
  rejectRequest,
  getActiveRentals,
  rentRequest
} from "./Controllers/rentalRequests.js";

// Controllers
import { loginUser } from "./Controllers/login.js";
import {
  getOffer,
  addOffer,
  updateOffer,
  deleteOffer,
  getAllOffers,
} from "./Controllers/offer.js";
import {
  getChatData,
  getChatContent,
  addChat,
  initSocket,
  getChatByUser,
} from "./Controllers/chat.js";
import { getMyOffers } from "./Controllers/dashboard.js";
import {
  getFav,
  AddFavoriteOffers,
  DeleteFavoriteOffer,
} from "./Controllers/fav.js";
import { signUp } from "./Controllers/signUP2.js";
import { account, accountDeleteImage, accountUploadImage, getUser, updateAccount } from "./Controllers/account.js";
import { sendMessage } from "./Controllers/contact.js";
import { getProfile, getProfileStats, getRentedOffers } from "./Controllers/profile.js";

// Load environment variables
env.config();
const app = express();
const port = process.env.PORT || 3001;
// CORS configuration
app.use(
  cors({
    origin: true, // This allows all origins
    credentials: true,
  })
);
// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(notificationsRouter);

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // set true in production with HTTPS
      httpOnly: false, // allow JS to read cookie (dev only)
      sameSite: "lax",
    },
  })
);

// ——————————————
// Session‐update endpoint
// ——————————————
app.post("/api/addObjectSession", (req, res) => {
  const { key, value } = req.body;

  if (!key || value === undefined) {
    return res
      .status(400)
      .json({ message: "You must provide a key and value" });
  }

  req.session[key] = value;

  res.json({
    message: `Session key '${key}' set`,
    session: req.session,
  });
});

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: true, // This allows all origins
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
});

// account & signup2
app.post("/api/login", loginUser);
app.post("/api/signup",signUp);
app.get("/getuser",getUser);
app.post("/api/account",account);
app.post("/api/account/update", updateAccount);
app.post("/api/account/upload-image",accountUploadImage);
app.post("/api/account/delete-image", accountDeleteImage);

//fav
app.get("/FavoriteOffers", getFav);
app.post("/AddFavoriteOffers", AddFavoriteOffers);
app.delete("/DeleteFavoriteOffer", DeleteFavoriteOffer);

// Offers endpoints
app.get("/getOffer/:offerID", getOffer);
app.post("/addOffer", upload.array("images", 10), addOffer);
app.put("/updateOffer/:offerID", upload.array("images", 10), updateOffer);
app.delete("/deleteOffer/:offerID", deleteOffer);
app.get("/offers", getAllOffers);


// Chat (HTTP)
app.get("/getChatData", getChatData);
app.get("/getchatcontent", getChatContent);
app.post("/addchat", addChat);
app.get("/getChatByUser", getChatByUser);
initSocket(io);

// Session info (for debugging)
app.get("/sessionInfo", (req, res) => {
  res.json(req.session);
});

// Dashboard "my offers"
app.get("/dashboard/offers", getMyOffers);
app.delete("/deleteOffer/:offerID", deleteOffer);


// Add this middleware to check session
app.get("/api/check-session", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.json({ user: req.session.user });
});

app.post('/rentRequest', rentRequest);

app.get("/dashboard/requests", getRequests);
app.post("/dashboard/requests/:id/accept", acceptRequest);
app.post("/dashboard/requests/:id/reject", rejectRequest);
app.get("/dashboard/active-rentals", getActiveRentals);




app.get(
  "/farmer/current-lands",
  (req, res, next) => {
    if (!req.session.user?.id) return res.status(401).json({ error: "Unauthorized" });
    next();
  },
  getCurrentLands
);

// Contact form endpoint
app.post("/api/contact/send-message", sendMessage);

// Profile endpoints
app.get("/getProfile", getProfile);
app.get("/profileStats", getProfileStats);
app.get("/rentedOffers", getRentedOffers);

// Start server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});