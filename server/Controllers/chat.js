// Controllers/chat.js
import db from "../db.js";

// Helper function to retrieve chats based on query parameters.
export const getChats = async ({ receiverID, senderID, chatID, offerID }) => {
  let query = "SELECT * FROM chats WHERE 1=1";
  let values = [];
  let index = 1; // To track parameter position

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

// GET /getchat - Retrieve chats based on query parameters.
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

// GET /getchatcontent - Retrieve content for a specific chat.
export async function getChatContent(req, res) {
  try {
    //console.log("refer",req.get("Referer"));
    const { chatID } = req.query;
    if (!chatID) {
      return res.status(400).send("Missing chatID");
    }
    const chatContents = await db.query(
      "SELECT contentFile, contentText, senderID, sent_at FROM ChatContents WHERE chatID = $1",
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
