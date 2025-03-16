import express from "express";
import pg from "pg";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Database connection using your credentials
const db = new pg.Client({
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

// Global middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer setup for file uploads (used in /addOffer)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// A simple GET route (from your code)
app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json({ message: "Hello from the server!", time: result.rows[0].now });
  } catch (err) {
    console.error("Error querying the database:", err);
    res.status(500).send("Error querying the database");
  }
});

// POST /addOffer endpoint (from your friend's code)
app.post("/addOffer", upload.array("images"), async (req, res) => {
  try {
    console.log("Received data:", req.body);

    const { offer_title, size, years, months, price, location, description, landOwnerID } = req.body;

    // Validate required fields
    if (!offer_title || !size || !location || !description || !price || !years || !months || !landOwnerID) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Calculate lease duration in months
    const leaseDuration = (parseInt(years) * 12) + parseInt(months);

    const values = [
      offer_title, 
      parseFloat(size), 
      location, 
      description, 
      parseFloat(price), 
      leaseDuration, 
      parseInt(landOwnerID)
    ];
    
    const addOfferResponse = await db.query(
      "INSERT INTO offers (landTitle, landSize, landLocation, offerDescription, landLeasePrice, leaseDuration, OwnerID) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values
    );

    console.log("Offer added successfully:", addOfferResponse.rows[0]);
    res.json({ message: "Offer added successfully", offerId: addOfferResponse.rows[0].id });
  } catch (error) {
    console.error("Error adding offer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
