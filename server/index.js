// index.js
import express from "express";
import cors from "cors";
import env from "dotenv";
import multer from "multer";
import { createServer } from "http";
import { Server } from "socket.io";
import bcrypt from 'bcrypt';
import session from "express-session";

// Import controllers
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

env.config();
const app = express();
const port = process.env.PORT || 3001;
const saltRounds = 10;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'your-secret-key', // use a strong secret!
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true if using HTTPS
}));
// app.use(bodyParser.json({ limit: '5mb' }));
//session test 
app.get("/", (req, res) => {
  req.session.user = { id: 1 };
  console.log("User session has been set!");
});
app.get("/check", (req, res) => {
  res.send(req.session.user);
});


// Set up multer for file uploads (for offers routes)
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

// Chat endpoints (HTTP)
app.get("/getchat", getChat);
app.get("/getchatcontent", getChatContent);
app.post("/addchat", addChat);

// Set up Socket.io along with HTTP server
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  let chatID = 0;

  socket.on("join", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // Socket event to initialize a chat session.
  socket.on("Initialize", async ({ sender, receiver, offer }) => {
    try {
      // Use the getChats helper from the chat controller.
      let chat = await getChats({ receiverID: receiver, senderID: sender, chatID: null, offerID: offer });
      if (chat.length > 0) {
        console.log("Chat already exists");
        chatID = chat[0].id;
      } else {
        console.log("Creating new chat");
        chat = await db.query(
          "INSERT INTO chats (senderID, receiverID, offerID) VALUES ($1, $2, $3) RETURNING id",
          [sender, receiver, offer]
        );
        chatID = chat[0].id;
      }
      
      console.log("Chat ID:", chat[0].id);
      socket.emit("InitialMessages", chat[0].id);
    } catch (error) {
      console.error("Error initializing chat:", error);
    }
  });

  socket.on("sendMessage", async ({ message, room, sender }) => {
    if (chatID) {
      if (typeof message === "string") {
        console.log(`Text message received from ${sender}: ${message} (chat ID: ${chatID})`);
        const response = await db.query(
          "INSERT INTO ChatContents (chatID, senderID, contentText) VALUES ($1, $2, $3) RETURNING contentID",
          [chatID, sender, message]
        );
        console.log("Stored text message, content ID:", response.rows[0].contentID);
      } else if (typeof message === "object") {
        const response = await db.query(
          "INSERT INTO ChatContents (chatID, senderID, contentFile) VALUES ($1, $2, $3) RETURNING contentID",
          [chatID, sender, message]
        );
        console.log("Stored image message, content ID:", response.rows[0].contentID);
        console.log(`Image message from ${sender}, format: ${message.format}`);
      } else {
        console.log("Unknown message format received.");
      }
    }
    console.log(`Message sent in room ${room}:`, message);
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

  // Basic validation
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  if (!['male', 'female'].includes(gender)) {
    return res.status(400).json({ error: 'Invalid gender' });
  }

  // Calculate age from date of birth
  const birthDate = new Date(year, month - 1, day);
  const ageDiff = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDiff);
  const age = Math.abs(ageDate.getUTCFullYear() - 1970);

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into database
    const query = `
      INSERT INTO users (firstname, lastname, password, phonenumber, email, age, address, gender)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, email, firstname, lastname
    `;

    const values = [
      firstName,
      lastName,
      hashedPassword,
      mobileNumber,
      email,
      age,
      address,
      gender
    ];

    const result = await db.query(query, values);
    
    res.status(201).json({
      message: 'User created successfully',
      user: result.rows[0] 
      
    });
  } catch (error) {
    console.error('Error during signup:', error);
    
    if (error.code === '23505') { // Unique violation
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
// Login endpoint
app.post('/api/login', async (req, res) => {
  const { emailOrPhone, password } = req.body;

  if (!emailOrPhone || !password) {
    return res.status(400).json({ error: 'Email/phone and password are required' });
  }

  try {
    // Check if user exists by email or phone number
    const query = `
      SELECT * FROM users 
      WHERE email = $1 OR phonenumber = $1
    `;
    const result = await db.query(query, [emailOrPhone]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid Account' });
    }

    const user = result.rows[0];

    // Compare hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Remove password from user data before sending
    const { password: _, ...userData } = user;

    res.status(200).json({
      message: 'Login successful',
      user: userData
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
const PORT = process.env.PORT || 3001;


export default app;

// Start the server with Socket.io support.
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/getuser', async (req, res) => {
  try {
    const userID = req.query.userID;
    
    if (!userID) {
      return res.status(400).json({ error: 'userID is required' });
    }

    
    if (isNaN(userID)) {
      return res.status(400).json({ error: 'Invalid userID' });
    }

    const response = await db.query(`SELECT * FROM users WHERE ID = $1`, [userID]);

    if (response.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(response.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
