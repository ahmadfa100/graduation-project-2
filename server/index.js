import express from "express";
import cors from "cors";
import env from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";

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

  socket.on("sendMessage", ({ message, room }) => {
    console.log(`Message sent in room ${room}:`, message);
    socket.to(room).emit("RecivedMessage", { message }); // gpt: Include sender ID
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
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
