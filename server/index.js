import express from "express";
import cors from "cors";
import env from "dotenv";
import multer from "multer";
import { createServer } from "http";
import { Server } from "socket.io";
import bcrypt from 'bcrypt';
import session from "express-session";
import { getMyOffers } from "./Controllers/dashboard.js"

// Import controllers
import { loginUser } from "./Controllers/login.js";
import {
  getOffer,
  addOffer,
  updateOffer,
  deleteOffer,
  getAllOffers,
} from "./Controllers/offer.js";
import { getNotifications } from "./Controllers/notification.js";
import { getChat, getChatContent, addChat, getChats } from "./Controllers/chat.js";
import db from "./db.js"; // Used in socket code

// Load environment variables
env.config();
const app = express();
const port = process.env.PORT || 3001;
const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;

// CORS configuration
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,    // set to true if using HTTPS in production
    httpOnly: false,  // allow JS to read the cookie (dev only)
    sameSite: 'lax'
  }
}));

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Authentication route
app.post('/api/login', loginUser);

// Offers endpoints
app.get("/getOffer/:offerID", getOffer);
app.post("/addOffer", upload.array("images", 10), addOffer);
app.put("/updateOffer/:offerID", upload.array("images", 10), updateOffer);
app.delete("/deleteOffer/:offerID", deleteOffer);
app.get("/offers", getAllOffers);

// Notifications endpoint
app.get("/api/notifications", getNotifications);

// Chat endpoints (HTTP)
app.get("/getchat", getChat);
app.get("/getchatcontent", getChatContent);
app.post("/addchat", addChat);

// HTTP root (session test)
app.get("/", (req, res) => {
  req.session.user = { id: 1 };
  console.log("User session has been set!");
  res.sendStatus(200);
});
app.get("/check", (req, res) => {
  res.json(req.session.user);
});

// Start HTTP server and bind Socket.io
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  let chatID = 0;

  socket.on("join", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("Initialize", async ({ sender, receiver, offer }) => {
    try {
      let chat = await getChats({ receiverID: receiver, senderID: sender, chatID: null, offerID: offer });
      if (chat.length > 0) {
        chatID = chat[0].id;
      } else {
        const result = await db.query(
          "INSERT INTO chats (senderID, receiverID, offerID) VALUES ($1, $2, $3) RETURNING id",
          [sender, receiver, offer]
        );
        chatID = result.rows[0].id;
      }
      socket.emit("InitialMessages", chatID);
    } catch (error) {
      console.error("Error initializing chat:", error);
    }
  });

  socket.on("sendMessage", async ({ message, room, sender }) => {
    if (!chatID) return;
    if (typeof message === "string") {
      await db.query(
        "INSERT INTO ChatContents (chatID, senderID, contentText) VALUES ($1, $2, $3)",
        [chatID, sender, message]
      );
    } else {
      await db.query(
        "INSERT INTO ChatContents (chatID, senderID, contentFile) VALUES ($1, $2, $3)",
        [chatID, sender, message]
      );
    }
    socket.to(room).emit("RecivedMessage", { message });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  const {
    firstName,
    lastName,
    address,
    day,
    month,
    year,
    gender,
    mobileNumber,
    email,
    password,
    confirmPassword
  } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }
  if (!['male', 'female'].includes(gender)) {
    return res.status(400).json({ error: 'Invalid gender' });
  }

  const birthDate = new Date(year, month - 1, day);
  const ageDiff = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDiff);
  const age = Math.abs(ageDate.getUTCFullYear() - 1970);

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const query = `
      INSERT INTO users (firstname, lastname, password, phonenumber, email, age, address, gender)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, email, firstname, lastname
    `;
    const values = [firstName, lastName, hashedPassword, mobileNumber, email, age, address, gender];
    const result = await db.query(query, values);
    res.status(201).json({ message: 'User created successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Error during signup:', error);
    if (error.code === '23505') {
      if (error.constraint === 'users_email_key') return res.status(400).json({ error: 'Email already exists' });
      if (error.constraint === 'users_phonenumber_key') return res.status(400).json({ error: 'Phone number already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID
app.get('/getuser', async (req, res) => {
  try {
    const userID = Number(req.query.userID);
    if (!userID) return res.status(400).json({ error: 'userID is required' });
    const response = await db.query('SELECT * FROM users WHERE id = $1', [userID]);
    if (response.rowCount === 0) return res.status(404).json({ error: 'User not found' });
    res.json(response.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// at the bottom of your routes, before server.listen
app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.clearCookie('connect.sid');      // or whatever your cookie name is
    res.json({ message: 'Logged out' });
  });
});


app.get("/getOffer/:offerID", getOffer);
app.post("/addOffer", upload.array("images", 10), addOffer);
app.put("/updateOffer/:offerID", upload.array("images", 10), updateOffer);
app.delete("/deleteOffer/:offerID", deleteOffer);
app.get("/offers", getAllOffers);

 // Dashboard “my offers”
 app.get("/dashboard/offers", getMyOffers);


// Start server with Socket.io
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});