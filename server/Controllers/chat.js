import { send } from "process";
import db from "../db.js";
import { error } from "console";

//Complex query will returnon initial data about chat such as the offer title and its image  Other participant and chatID
export async function getChatData(req, res) {
  const { offerID, userID } = req.query;
  if (!req.session.user?.id) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  if (!offerID || !userID) {
    return res.status(400).json({ error: 'Missing offerID or userID' });
  }

  const currentUserID = req.session.user.id;

  try {
    const result = await db.query(
      ` WITH existing_chat AS (
      SELECT ID FROM Chats 
      WHERE offerID = $1 AND 
            ((senderID = $2 AND receiverID = $3) OR (senderID = $3 AND receiverID = $2))
      LIMIT 1
    ), new_chat AS (
      INSERT INTO Chats (senderID, receiverID, offerID)
      SELECT $2, $3, $1
      WHERE NOT EXISTS (SELECT 1 FROM existing_chat)
      RETURNING ID
    ), final_chat AS (
      SELECT ID FROM existing_chat
      UNION
      SELECT ID FROM new_chat
    )
    SELECT 
      C.ID AS chatID,
      U.ID AS participantID,
      U.FirstName,
      U.LastName,
      O.landTitle,
      LP.picture AS offerImage
    FROM Chats C
    JOIN final_chat fc ON C.ID = fc.ID
    JOIN users U ON (U.ID = CASE 
                              WHEN C.senderID = $2 THEN C.receiverID 
                              ELSE C.senderID 
                            END)
    JOIN Offers O ON O.ID = C.offerID
    LEFT JOIN landPicture LP ON LP.landID = C.offerID
    LIMIT 1;
      `,
      [offerID, currentUserID, userID]
    );

    if (result.rows.length === 0) {
      console.log("not found");
      return res.status(404).json({error:'Not Found'});
    }

    // Convert image to base64 string if it exists
    const chatInfo = result.rows[0];
    if (chatInfo.offerimage) {
      chatInfo.offerImage = chatInfo.offerimage.toString('base64');
    }
    chatInfo.currentUserID = currentUserID;

    res.json(chatInfo);
  } catch (err) {
    console.error('Error fetching chat:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getChatByUser(req, res) {
  try {
    if (!req.session.user?.id) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userID = req.session.user.id;
    let response = [];

    const chats = await db.query(
      "SELECT * FROM CHATS WHERE receiverID = $1 OR senderID = $1 ORDER BY chatDate DESC",
      [userID]
    );

    if (chats.rowCount > 0) {
      for (const item of chats.rows) {
        // Get offer info with one image
        const offer = await db.query(
          "SELECT o.id AS offerID, o.landTitle, lp.picture FROM offers o JOIN landPicture lp ON lp.landID = o.id WHERE o.id = $1 LIMIT 1",
          [item.offerid]
        );

        // Fallback if no offer/image is found
        const offerData = offer.rows[0] || { landtitle: null, picture: null };
//console.log("offerData : ",offerData.offerid);
        // Get other participant
        const otherParticipantID =
          userID === item.senderid ? item.receiverid : item.senderid;

        const otherParticipant = await db.query(
          "SELECT ID ,FirstName, LastName FROM USERS WHERE ID = $1",
          [otherParticipantID]
        );

        const otherName =
          otherParticipant.rows.length > 0
            ? `${otherParticipant.rows[0].firstname} ${otherParticipant.rows[0].lastname}`
            : "Unknown User";

        // Push final object
        response.push({
          otherParticipantID: otherParticipant.rows[0].id ,
          offerID: offerData.offerid,
          otherParticipantName: otherName,
          offerTitle: offerData.landtitle,
          offerPicture: offerData.picture ? `data:image/jpeg;base64,${offerData.picture.toString("base64")}`: null,
        });
      }
    }
//console.log("response: ",response[1]);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error getChatByUser:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error (getChatByUser)" });
  }
}


export const getChats = async ({ receiverID, senderID, chatID, offerID }) => {
  let query = "SELECT * FROM chats WHERE 1=1";
  let values = [];
  let index = 1; //  track

  if (receiverID && senderID) {
    query += ` AND ((receiverID = $${index} AND senderID = $${index + 1}) OR (receiverID = $${index + 1} AND senderID = $${index}))`;
    values.push(receiverID, senderID);
    index += 2;
  } else {
    if (receiverID) {
      query += ` AND receiverID = $${index++}`;
      values.push(receiverID);
    }
    if (senderID) {
      query += ` AND senderID = $${index++}`;
      values.push(senderID);
    }
  }

  if (offerID) {
    query += ` AND offerID = $${index++}`;
    values.push(offerID);
  }
  if (chatID) {
    query += ` AND chatID = $${index++}`;
    values.push(chatID);
  }

  const result = await db.query(query, values);
  return result.rows;
};

export async function getChat(req, res) {
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
}

export async function getChatContent(req, res) {
  try {
    //console.log("refer",req.get("Referer"));
    const { chatID } = req.query;
    if (!chatID) {
      return res.status(400).send("Missing chatID");
    }
    const chatContents = await db.query(
      "SELECT contentFile, contentText, senderID, sent_at FROM ChatContents WHERE chatID = $1 ORDER BY sent_at DESC LIMIT 50",
      [chatID]
    );
    if (chatContents.rowCount > 0) {
      res.json(chatContents.rows);
    } else {
      res.status(404).send("Not Found");
    }
  } catch (error) {
    console.error("Error retrieving chat contents:", error);
    res.status(500).send("Internal Server Error");
  }
}

// POST /addchat - Create a new chat.
export async function addChat(req, res) {
  try {
    const { receiverID, senderID, offerID } = req.body;
    const response = await db.query(
      "INSERT INTO chats (receiverID, senderID, offerID) VALUES ($1, $2, $3) RETURNING ID",
      [receiverID, senderID, offerID]
    );
    res.send(response.rows[0]);
  } catch (error) {
    console.error("Error adding chat:", error);
    res.status(500).send("Internal Server Error");
  }
}
export const initSocket = (io) => {io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  let chatID = 0;

  socket.on("join", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("Initialize", async ({ sender, receiver, offer }) => {
    try {
      let chat = await getChats({
        receiverID: receiver,
        senderID: sender,
        chatID: null,
        offerID: offer,
      });
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
});}