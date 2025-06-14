import express from "express";
import cors from "cors";
import env from "dotenv";
import multer from "multer";
import { createServer } from "http";
import { Server } from "socket.io";
import session from "express-session";
import db from "./db.js";
import notificationsRouter  from "./Controllers/notifications.js";
import { getCurrentLands, getFarmerRequests } from "./Controllers/farmerLands.js";
import { getPastLands } from "./Controllers/landownerLands.js"; 

import {
  getRequests,
  acceptRequest,
  rejectRequest,
  getActiveRentals,
  rentRequest
} from "./Controllers/rentalRequests.js";

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
import { getProfile, getProfileStats, getRentedOffers, getUserOffers } from "./Controllers/profile.js";

import pgSession from 'connect-pg-simple';

env.config();
const app = express();
const port = process.env.PORT || 3001;
app.use(
  cors({
    origin: true, 
    credentials: true,
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(notificationsRouter);

const sessionStore = new (pgSession(session))({
  pool: db, 
  tableName: 'sessions',
});

app.use(
  session({
    store: sessionStore, 
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, 
      httpOnly: false, 
      sameSite: "lax",
    },
  })
);

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

const storage = multer.memoryStorage();
const upload = multer({ storage });

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: true, 
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

app.post("/api/login", loginUser);
app.post("/api/signup",signUp);
app.get("/getuser",getUser);
app.post("/api/account",account);
app.post("/api/account/update", updateAccount);
app.post("/api/account/upload-image",accountUploadImage);
app.post("/api/account/delete-image", accountDeleteImage);

app.get("/FavoriteOffers", getFav);
app.post("/AddFavoriteOffers", AddFavoriteOffers);
app.delete("/DeleteFavoriteOffer", DeleteFavoriteOffer);

app.get("/getOffer/:offerID", getOffer);
app.post("/addOffer", upload.array("images", 10), addOffer);
app.put("/updateOffer/:offerID", upload.array("images", 10), updateOffer);
app.delete("/deleteOffer/:offerID", deleteOffer);
app.get("/offers", getAllOffers);


app.get("/getChatData", getChatData);
app.get("/getchatcontent", getChatContent);
app.post("/addchat", addChat);
app.get("/getChatByUser", getChatByUser);
initSocket(io);

app.get("/sessionInfo", (req, res) => {
  res.json(req.session);
});

app.get("/dashboard/offers", getMyOffers);
app.delete("/deleteOffer/:offerID", deleteOffer);


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

app.post("/api/contact/send-message", sendMessage);

app.get("/getProfile/:userID", getProfile);
app.get("/profileStats/:userID", getProfileStats);
app.get("/rentedOffers/:userID", getRentedOffers);
app.get("/getUserOffers/:userID",getUserOffers)


app.get("/dashboard/past-lands", getPastLands);

app.get(
  "/farmer/requests",
  (req, res, next) => {
    if (!req.session.user?.id) return res.status(401).json({ error: "Unauthorized" });
    next();
  },
  getFarmerRequests
);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

io.on("connection", (socket) => {
});

export default app;