// Controllers/farmerLands.js
import db from "../db.js";

export async function getCurrentLands(req, res) {
  const farmerID = req.session.user?.id;
  if (!farmerID) return res.status(401).json({ error: "Not authenticated" });

  try {
    const { rows } = await db.query(
      `SELECT
  o.id                 AS "offerID",
  o.landtitle          AS "landTitle",
  o.landlocation       AS "landLocation",
  rd.end_date          AS "endDate",
  u.firstname          AS "landownerFirstName",
  u.lastname           AS "landownerLastName",
  lp.picture           AS "landPicture"
FROM rentaldeals rd
JOIN offers o
  ON o.id = rd.offerid
JOIN users u
  ON u.id = o.ownerid
LEFT JOIN (
  SELECT DISTINCT ON (landid) landid, picture
  FROM landpicture
  ORDER BY landid, id -- take the first image per land based on ID
) lp ON lp.landid = o.id
WHERE rd.farmerid = $1
  AND rd.status = 'accepted'
ORDER BY rd.end_date ASC;
`,
      [farmerID]
    );
    console.log("current lands",rows);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching current lands:", err);
    res.status(500).json({ error: "DB error" });
  }
}
