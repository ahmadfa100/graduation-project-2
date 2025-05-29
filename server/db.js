import pkg from "pg";
import cron from "node-cron";
import env from "dotenv";

const { Pool } = pkg;
env.config();

const db = new Pool({
  user:     process.env.DB_USER,
  host:     process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port:     parseInt(process.env.DB_PORT, 10),
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

cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Running scheduled offer cleanup...');
    await db.query(`
      DELETE FROM offers
      WHERE offerDate < NOW() - INTERVAL '1 year' AND isReserved = false
    `);
    await db.query(`
      DELETE FROM RentalDeals WHERE createdAt < NOW() - INTERVAL '1 year' AND (status <> 'accepted' OR status IS NULL)
      `);
      await db.query(`
      DELETE FROM Chats WHERE chatDate < NOW() - INTERVAL '1 year' 
      `);
    await db.query(` DELETE FROM sessions WHERE createdAt < NOW() - INTERVAL '2 weeks' `);
    console.log('Old offers, chats, sessions, and deals deleted successfully.');
    
  } catch (err) {
    console.error('Error deleting old offers:', err);
  }
});


export default db;