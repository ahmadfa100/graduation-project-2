// index.js
import express from "express";
import cors from "cors";
import env from "dotenv";
import multer from "multer";
import { createServer } from "http";
import { Server } from "socket.io";

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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
      } else {
        console.log("Creating new chat");
        chat = await db.query(
          "INSERT INTO chats (senderID, receiverID, offerID) VALUES ($1, $2, $3) RETURNING id",
          [sender, receiver, offer]
        );
      }
      chatID = chat[0].id;
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

// Start the server with Socket.io support.
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
