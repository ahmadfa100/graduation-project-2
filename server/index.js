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
let chatID=0;
  socket.on("join", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });
  socket.on("Initialize", async({ sender, receiver, offer })=>{
    try{
 let chat = await getChats({ receiverID: receiver, senderID: sender, chatID: null, offerID:offer });
 if(chat.length > 0){
   console.log("chat is already exist");
 }
 else{
  console.log("new chat");
    chat = await db.query(
      "INSERT INTO chats (senderID, receiverID, offerID) VALUES ($1, $2, $3) RETURNING id",
      [sender, receiver, offer]
    );

 }
 chatID=chat[0].id;
    console.log("chat id :", chat[0].id);
 socket.emit("InitialMessages", chat[0].id);
 }catch(error){
  console.error("Error retrieving chats:", error);

    }

    
  });

  socket.on("sendMessage",async ({ message, room,sender }) => {

 if(chatID){
     
if (typeof message === "string") {
  console.log( `Text message received from ${sender}: ${message} :chat id : ${chatID}`);
   const response = await db.query("INSERT INTO ChatContents (chatID, senderID, contentText)  VALUES ($1,$2,$3) Returning contentID ",[chatID,sender,message]);
  console.log( "storing text message",response.rows[0].contentID);
} else if (typeof message === "object") {
  const response = await db.query("INSERT INTO ChatContents (chatID, senderID, contentFile)  VALUES ($1,$2,$3) Returning contentID ",[chatID,sender,message]);
  console.log( "storing image message",response.rows[0].contentID);
  console.log(
    `Image message received from ${sender}, format: ${message.format}`
  );
  // You can store the Base64 data in a database or decode it for storage
} else {
  console.log("Unknown message format received.");
}

 }





    console.log(`Message sent in room ${room}:`, message);
    socket.to(room).emit("RecivedMessage", { message }); // gpt: Include sender ID
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.get("/getchat", async (req, res) => {
  try {
    const { receiverID, senderID, chatID, offerID } = req.query;
    const chats = await getChats({ receiverID, senderID, chatID, offerID });

    if (chats.length > 0) {
      res.json(chats);
    } else {
      res.status(404).send("Not Found");
    }
  } catch (error) {
    console.error("Error retrieving chats:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/getchatcontent', async (req, res)=> {
  const { chatID } = req.query;
  const chatContents = await db.query("SELECT contentFile ,contentText,senderID FROM ChatContents WHERE chatID = $1",[chatID] );
    
 console.log("chat contents: ",chatContents);

    
 
});



app.post('/addchat',async(req,res) => {
  const { receiverID, senderID,offerID } = req.body;
  const response = await db.query(
    "INSERT INTO chats (receiverID, senderID,offerID) VALUES ($1, $2,$3) RETURNING ID",
    [receiverID, senderID, offerID]
  );
  res.send(response.rows[0]);
});

const getChats = async ({ receiverID, senderID, chatID, offerID }) => {
  let query = "SELECT * FROM chats WHERE 1=1";
  let values = [];
  let index = 1; // To track parameter position

  if (receiverID) {
    query += ` AND receiverID = $${index++}`;
    values.push(receiverID);
  }
  if (senderID) {
    query += ` AND senderID = $${index++}`;
    values.push(senderID);
  }
  if (offerID) {
    query += ` AND offerID = $${index++}`;
    values.push(offerID);
  }
  if (chatID) {
    query += ` AND chatID = $${index++}`;
    values.push(chatID);
  }

  return (await db.query(query, values)).rows;
};


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
