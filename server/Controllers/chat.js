import { send } from "process";
import db from "../db.js";

export async function getChat2(req,res) {
  const { offerID, userID } = req.query;
  if (!req.session.user?.id) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  if (!offerID || !userID) {
      return res.status(400).json({ error: 'Missing offerID or userID' });
  }
 const currentUserID= req.session.user.id;
  try {
      const result = await db.query(
          `SELECT * FROM Chats 
           WHERE offerID = $1 AND ((senderID = $2 AND receiverID = $3)OR(senderID = $3 AND receiverID = $2))`,
          [offerID,currentUserID ,userID]
      );

      if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Chat not found' });
      }

      res.json(result.rows[0] );
  } catch (err) {
      console.error('Error fetching chat :', err);
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
