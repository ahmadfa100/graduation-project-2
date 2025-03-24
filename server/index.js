import express from "express";
import cors from "cors";
import env from "dotenv";
import offersRoutes from "./Routes/offerRoutes.js";
import router from "./Routes/filterRoutes.js";
import notificationsRoutes from "./Routes/notificationsRoutes.js";
//import chat from "./Routes/chat.js";

env.config();
const app = express();
const port = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", offersRoutes);
//app.use("/", chat);
app.use("/", router);
app.use("/api/notifications", notificationsRoutes);

//////////////////////////////////////////

import { Server } from "socket.io";
import { createServer } from "http";

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected :", socket.id);

  socket.on("join",(data)=>{
    socket.join(data);
    console.log("User joined room :", data);
  })

  socket.on("sendMessage", (data) =>{
    console.log("Sent message :", data.message);

    socket.broadcast.emit("RecivedMessage", data.message);
    //socket.to(data.room).emit("RecivedMessage",data);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected :", socket.id);
  });
}

);
 
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
