import express from "express";
import cors from "cors";
import env from "dotenv";
import multer from "multer";
import { createServer } from "http";
import { Server } from "socket.io";
import bcrypt from 'bcrypt';
import session from "express-session";
import db from "./db.js"; // Used in socket code
import notificationsRouter from "./Controllers/notifications.js";

// Controllers
import { loginUser } from "./Controllers/login.js";
import {
  getOffer,
  addOffer,
  updateOffer,
  deleteOffer,
  getAllOffers,
} from "./Controllers/offer.js";
import { getNotifications } from "./Controllers/notification.js";
import { getChatID, getChatContent, addChat, getChats,getChatByUser } from "./Controllers/chat.js";
import { getMyOffers } from "./Controllers/dashboard.js";

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

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(notificationsRouter);

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,    // set true in production with HTTPS
    httpOnly: false,  // allow JS to read cookie (dev only)
    sameSite: 'lax'
  }
}));

// ——————————————
// Session‐update endpoint
// ——————————————
app.post('/api/addObjectSession', (req, res) => {
  const { key, value } = req.body;

  if (!key || value === undefined) {
    return res.status(400).json({ message: 'You must provide a key and value' });
  }

  req.session[key] = value;

  res.json({
    message: `Session key '${key}' set`,
    session: req.session
  });
});

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Authentication routes
app.post('/api/login', loginUser);
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
      if (error.constraint === 'users_email_key') {
        return res.status(400).json({ error: 'Email already exists' });
      }
      if (error.constraint === 'users_phonenumber_key') {
        return res.status(400).json({ error: 'Phone number already exists' });
      }
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get("/FavoriteOffers", async (req, res) => {
  
  const userID = req.session?.user?.id;
const {offerID}=req.query;
  if (!userID) {
    return res.status(401).json({ error: "Not logged in" });
  }
  if(!offerID){
    const result = await db.query("SELECT * FROM FavoriteOffers WHERE farmerID=($1)",[userID]);
   console.log("ttt");
console.log("rows: ",result.rows);
    return res.status(200).json(result.rows);
  }

  try {
    const result = await db.query("SELECT * FROM FavoriteOffers WHERE offerID=($1) AND farmerID=($2)",[offerID,userID]);
   res.json(result.rows);
  } catch (error) {
    console.error("Error fetching favorite offers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/AddFavoriteOffers", async (req, res) => {
  const userID = req.session.user.id;
  const { offerID } = req.body; // ✅ Correct source

  //console.log(userID, "///", offerID);

  if (!userID || !offerID) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await db.query(
      "INSERT INTO FavoriteOffers (farmerID, offerID) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [userID, offerID] // ✅ Correct way to pass params
    );
    res.status(200).json({ message: "Favorite offer added successfully" });
    console.log("Successfully added to favorite offer");
  } catch (error) {
    console.error("Error adding favorite offer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/DeleteFavoriteOffer", async (req, res) => {
 // console.log("kkkk :", req.session.user.id);
  const userID = req.session.user.id;
  const { offerID } = req.body;

  if (!userID || !offerID) {
    return res.status(400).json({ error: "Missing required fields" });
  }


  try {
    await db.query(
      "DELETE FROM FavoriteOffers WHERE farmerID = $1 AND offerID = $2",
      [userID, offerID]
    );
    res.status(200).json({ message: "Favorite offer deleted successfully" });
    console.log("Successfully deleted from favorite offer");
  } catch (error) {
    console.error("Error deleting favorite offer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


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

app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});

// Offers endpoints
app.get("/getOffer/:offerID", getOffer);
app.post("/addOffer", upload.array("images", 10), addOffer);
app.put("/updateOffer/:offerID", upload.array("images", 10), updateOffer);
app.delete("/deleteOffer/:offerID", deleteOffer);
app.get("/offers", getAllOffers);

// Notifications
app.get("/api/notifications", getNotifications);

// Chat (HTTP)
app.get("/getchatID", getChatID);
app.get("/getchatcontent", getChatContent);
app.post("/addchat", addChat);
app.get("/getChatByUser",getChatByUser)

// Session info (for debugging)
app.get("/sessionInfo", (req, res) => {
  res.json(req.session);
});

// Dashboard “my offers”
app.get("/dashboard/offers", getMyOffers);

// Start HTTP server and bind Socket.io
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket.io setup
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

// Get user data
app.post('/api/account', async (req, res) => {
  const { userId } = req.body;
  
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
      const  dbase = await db.query(`
          SELECT firstname, lastname, email, phonenumber, gender, address, age, encode(pfp, 'base64') AS profileimage 
          FROM users 
          WHERE id = $1`, [userId]);

      if (dbase.rowCount === 0) {
        return res.status(404).json({ error: 'User not found' });
       
      }
      const user = dbase.rows[0];
  
      res.json({
          fullName: `${user.firstname} ${user.lastname}`,
          email: user.email,
          mobileNumber: user.phonenumber,
          gender: user.gender,
          address: user.address,
          age: user.age,
          profileImage: user.profileimage ? `data:image/png;base64,${user.profileimage}` : null,
      });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch user' });
  }
});
// Update user field
app.post('/api/account/update', async (req, res) => {
  const { userId, fullName, email, mobileNumber, gender, address, age, password } = req.body;

  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
      if (fullName) {
          const [firstname, ...last] = fullName.split(' ');
          const lastname = last.join(' ') || '';
          await db.query(`UPDATE users SET firstname = $1, lastname = $2 WHERE id = $3`, [firstname, lastname, userId]);
      }
      if (email) {
          await db.query(`UPDATE users SET email = $1 WHERE id = $2`, [email, userId]);
      }
      if (mobileNumber) {
          await db.query(`UPDATE users SET phonenumber = $1 WHERE id = $2`, [mobileNumber, userId]);
      }
      if (gender) {
          await db.query(`UPDATE users SET gender = $1 WHERE id = $2`, [gender, userId]);
      }
      if (address) {
          await db.query(`UPDATE users SET address = $1 WHERE id = $2`, [address, userId]);
      }
      if (age) {
          await db.query(`UPDATE users SET age = $1 WHERE id = $2`, [age, userId]);
      }
      if (password) {
          const hashed = await bcrypt.hash(password, 10);
          await db.query(`UPDATE users SET password = $1 WHERE id = $2`, [hashed, userId]);
      }

      res.json({ success: true });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Update failed' });
  }
});

// Upload profile image
app.post('/api/account/upload-image', async (req, res) => {
  const { userId, image } = req.body;

  if (!userId || !image) return res.status(400).json({ error: 'Missing userId or image' });

  try {
      const base64Data = image.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');

      await db.query(`UPDATE users SET pfp = $1 WHERE id = $2`, [buffer, userId]);
      res.json({ success: true });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Image upload failed' });
  }
});

// Delete profile image
app.post('/api/account/delete-image', async (req, res) => {
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
      await db.query(`UPDATE users SET pfp = NULL WHERE id = $1`, [userId]);
      res.json({ success: true });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Image deletion failed' });
  }
});



// Start server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
