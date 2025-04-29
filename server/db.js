import pkg from "pg";
import cron from "node-cron";
import env from "dotenv";

const { Pool } = pkg;
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
// const db = new Pool({
//   user: process.env.DBuser,
//    host: process.env.DBhost,
//    database: process.env.database, // Removed extra space
//    password: process.env.DBpassword,
//    port:  process.env.DBport,
// });


db.connect((err) => {
  if (err) {
    console.error("Failed to connect to the database:", err);
  } else {
    console.log("Connected to PostgreSQL database!");
  }
});

cron.schedule('19 20 * * *', async () => {
  try {
    console.log('Running scheduled offer cleanup...');
    await db.query(`
      DELETE FROM offers
      WHERE offerDate < NOW() - INTERVAL '1 year' AND isReserved = false
    `);
    await db.query(`
      DELETE FROM RentalDeals WHERE createdAt < NOW() - INTERVAL '1 year' AND isAccepted = false
      `);
    console.log('Old offers AND deals deleted successfully.');
  } catch (err) {
    console.error('Error deleting old offers:', err);
  }
});


export default db;