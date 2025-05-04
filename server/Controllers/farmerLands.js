// Controllers/farmerLands.js
import db from "../db.js";

export async function getCurrentLands(req, res) {
  const farmerID = req.session.user?.id;
  if (!farmerID) return res.status(401).json({ error: "Not authenticated" });

  try {
    const { rows } = await db.query(
      `SELECT
         rd.id,
         o.landtitle         AS "landTitle",
         o.landlocation      AS "landLocation",
         rd.end_date         AS "endDate",
         u.firstname         AS "landownerFirstName",
         u.lastname          AS "landownerLastName"
       FROM rentaldeals rd
       JOIN offers o
         ON o.id = rd.offerid
       JOIN users u
         ON u.id = o.ownerid
       WHERE rd.farmerid = $1
         AND rd.status   = 'accepted'
       ORDER BY rd.end_date ASC`,
      [farmerID]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching current lands:", err);
    res.status(500).json({ error: "DB error" });
  }
}
