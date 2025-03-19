import express, { response } from "express";
import cors from "cors";
import multer from "multer";
import env from "dotenv";
import pkg from "pg";
const { Pool } = pkg;




const app = express();
const port = 3001;

env.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//local database
// const db = new Pool({
//   user: process.env.DBuser,
//   host: process.env.DBhost,
//   database: process.env.database, // Removed extra space
//   password: process.env.DBpassword,
//   port:  process.env.DBport,
// });

const db = new Pool({
  user: "ahmad",
  host: "dpg-cva25fd6l47c739glm10-a.frankfurt-postgres.render.com",
  database: "green_bridge_82xx", 
  password: "EBqFKSQgSM4yPiRwWmpcObj3ob7wU2tz", 
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

db.connect((err) => {
  if (err) {
    console.error("Failed to connect to the database:", err);
  } else {
    console.log("Connected to PostgreSQL database!");
  }
});

// Multer setup for file uploads (images)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get('/getOffer/:offerID', async (req, res) => {
  try {
    const offerID = req.params.offerID;
   // console.log("offerid: " + offerID);
    const offerinfo = await db.query("SELECT * FROM offers WHERE id = $1", [offerID]);

    if (offerinfo.rowCount === 0) {
      return res.status(404).json({ error: "Offer not found" });
    }

    const offerimages = await db.query("SELECT picture FROM landPicture WHERE landID = $1", [offerID]);

    // Convert images to base64 if they are stored as binary
    const images = offerimages.rows.map((row) =>
      `data:image/jpeg;base64,${row.picture.toString("base64")}`
    );

    const response = {
      offer: offerinfo.rows[0],
      images: images
    };
//console.log(response);
    res.json(response);
  } catch (err) {
    console.error("Error fetching offer:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/addOffer", upload.array("images",10), async (req, res) => {
  try {
    //console.log("Received data:\n images:", req.files,"data:", req.body);

    const { offer_title, size, years, months, price, location, description, landOwnerID } = req.body;


    if (!offer_title || !size || !location || !description || !price || !years||!months || !landOwnerID) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const leaseDuration = (parseInt(years ) * 12) + parseInt(months );

    
    const values = [offer_title, parseFloat(size), location, description, parseFloat(price), leaseDuration, parseInt(landOwnerID)];
    const AddOfferResponse = await db.query(
      "INSERT INTO offers (landTitle, landSize, landLocation, offerDescription, landLeasePrice, leaseDuration, OwnerID) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values
    );
req.files.forEach(async (file) => {
  const addimages = await db.query("INSERT INTO landPicture (landID,picture) values($1,$2)",[ AddOfferResponse.rows[0].id ,file.buffer]);
});


   // console.log("Offer added successfully:", AddOfferResponse.rows[0]);
    res.json({ message: "Offer added successfully", offerId: AddOfferResponse.rows[0].id });

  } catch (error) {
    console.error("Error adding offer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

});

app.put("/updateOffer/:offerID", upload.array("images", 10), async (req, res) => {
  try {
   // console.log("Received data:\n images:", req.files, "data:", req.body);

    const { offer_title, size, years, months, price, location, description, landOwnerID } = req.body;
    const { offerID } = req.params;

    if (!offerID || !offer_title || !size || !location || !description || !price || !years || !months || !landOwnerID) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const leaseDuration = parseInt(years) * 12 + parseInt(months);

    const values = [
      offer_title,
      parseFloat(size),
      location,
      description,
      parseFloat(price),
      leaseDuration,
      parseInt(landOwnerID),
      parseInt(offerID)
    ];

    const updateOfferResponse = await db.query(
      "UPDATE offers SET landTitle = $1, landSize = $2, landLocation = $3, offerDescription = $4, landLeasePrice = $5, leaseDuration = $6, OwnerID = $7 WHERE id = $8 RETURNING id",
      values
    );

    if (updateOfferResponse.rowCount === 0) {
      return res.status(404).json({ error: "Offer not found" });
    }

    
    await db.query("DELETE FROM landPicture WHERE landID = $1", [offerID]);

    
    for (const file of req.files) {
      await db.query("INSERT INTO landPicture (landID, picture) VALUES ($1, $2)", [offerID, file.buffer]);
    }

   // console.log("Offer updated successfully:", updateOfferResponse.rows[0]);
    res.json({ message: "Offer updated successfully", offerId: updateOfferResponse.rows[0].id });

  } catch (error) {
    console.error("Error updating offer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } 
});

app.delete("/deleteOffer/:offerID", async (req, res) => {
  try {
    const { offerID } = req.params;
    console.log("id = " + offerID);
    const deleteImageResponse= await db.query("DELETE FROM landPicture WHERE landID= $1 ",[offerID]); 
    if (deleteImageResponse.rowCount === 0) {
      console.log("No images found for deletion.");
    }else{
      console.log("Deleted images count: " + deleteImageResponse.rowCount);
    }   
  const deleteOfferResponse= await db.query("DELETE FROM Offers WHERE ID= $1  RETURNING landTitle ",[offerID]);
  if (deleteOfferResponse.rows.length === 0) {
    console.log("No matching offer found for deletion.");
    return res.status(404).json({ error: "Offer not found" });
  }
  
  console.log(" the Offer deleted successfully:", deleteOfferResponse.rows[0]);//print nothig
  res.json({ message: " the Offer deleted successfully", landTitle: deleteOfferResponse.rows[0].landTitle });
}catch(error){
  console.error("Error deleting offer:", error);
  res.status(500).json({ error: "Internal Server Error" });
}});












app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
