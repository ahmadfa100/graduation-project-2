import express, { response } from "express";
import cors from "cors";
import env from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";
import db from "./db.js";
env.config();
const app = express();
const port = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("sendMessage",async ({ message, room }) => {








    console.log(`Message sent in room ${room}:`, message);
    socket.to(room).emit("RecivedMessage", { message }); // gpt: Include sender ID
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.get("/getchat", async (req, res) => {
  const { receiverID, senderID, chatID,offerID } = req.query;
let query = "SELECT * FROM chats WHERE 1=1";
  let values = [];
  if (receiverID) {
    query += " AND receiverID = $1";
    values.push(receiverID);
  }
  if (senderID) {
    query += " AND senderID = $2";
    values.push(senderID);
  }
  if (offerID) {
    query += " AND offerID = $3";
    values.push(offerID);
  }
  if (chatID) {
    query += " AND chatID = $3";
    values.push(chatID);
  }

  const chats = await db.query(query, values);
  
  if(chats.rows){
    res.json(chats.rows);
  }
  else{
    res.status(404).send("Not Found");
  }



});
app.post('/addchat',async(req,res) => {
  const { receiverID, senderID,offerID } = req.body;
  const response = await db.query(
    "INSERT INTO chats (receiverID, senderID,offerID) VALUES ($1, $2,$3) RETURNING ID",
    [receiverID, senderID, offerID]
  );
  res.send(response.rows[0]);
});

//////////////////////////////////////////////////////////

import offersRoutes from "./Routes/offerRoutes.js";
import router from "./Routes/filterRoutes.js";
import notificationsRoutes from "./Routes/notificationsRoutes.js";
//import chat from "./Routes/chat.js";

env.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", offersRoutes);
//app.use("/", chat);
app.use("/", router);
app.use("/api/notifications", notificationsRoutes);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
