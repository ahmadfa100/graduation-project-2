import express from "express";
import cors from "cors";
import pg from "pg";
import multer from "multer";
import env from "dotenv";

const app = express();
const port = 3001;

env.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = new pg.Client({
  user: process.env.DBuser,
  host: process.env.DBhost,
  database: process.env.database, // Removed extra space
  password: process.env.DBpassword,
  port:  process.env.DBport,
});

db.connect()
  .then(() => console.log("Database connection established"))
  .catch((err) => console.error("Database connection error:", err));

// Multer setup for file uploads (images)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/addOffer", upload.array("images"), async (req, res) => {
  try {
    console.log("Received data:", req.body);

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


    console.log("Offer added successfully:", AddOfferResponse.rows[0]);
    res.json({ message: "Offer added successfully", offerId: AddOfferResponse.rows[0].id });

  } catch (error) {
    console.error("Error adding offer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
