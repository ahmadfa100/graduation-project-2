import express from "express";
import pg from "pg";

const app = express();
const port = 3000;

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

app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json({ message: "Hello from the server!", time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error querying the database");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
