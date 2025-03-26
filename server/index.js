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

app.get("/getchat/:receiverID?/:senderID?/:chatID?", async (req, res) => {
  const { receiverID, senderID, chatID } = req.params;
  const response = await db.query("SELECT ID FROM chat WHERE receiverID=($1) AND senderID=($2)",receiverID,senderID);
  if (response.rows.length === 0) {
   res.status(404).send("Not Found");
  }
  else {
    res.send(response.rows[0]);
  }
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
