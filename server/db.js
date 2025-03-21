import pkg from "pg";
const { Pool } = pkg;
import env from "dotenv";
env.config();

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

export default db;
