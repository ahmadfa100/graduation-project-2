import pkg from "pg";
const { Pool } = pkg;
import env from "dotenv";
env.config();

const db = new Pool({
  user: "ahmad",
  host: "dpg-cvr63195pdvs73ecfu9g-a.frankfurt-postgres.render.com",
  database: "green_bridge_pryw",
  password: "l34MLDs3bW2TbqPdS1KCMH8FNGLqeNvV", 
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
