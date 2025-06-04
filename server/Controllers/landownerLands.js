import db from "../db.js";

export async function getPastLands(req, res) {
  const ownerID = req.session.user?.id;
  if (!ownerID) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const { rows } = await db.query(
      `
        SELECT
          rd.id                   AS "dealID",
          o.id                    AS "offerID",
          o.landtitle             AS "landTitle",
          o.landlocation          AS "landLocation",
          rd.start_date           AS "startDate",
          rd.end_date             AS "endDate",
          u.firstname             AS "farmerFirstName",
          u.lastname              AS "farmerLastName"
        FROM rentaldeals rd
        JOIN offers o ON o.id = rd.offerid
        JOIN users u  ON u.id = rd.farmerid
        WHERE rd.landownerid = $1
          AND rd.status      = 'accepted'
          AND rd.end_date    < NOW()
        ORDER BY rd.end_date DESC;
      `,
      [ownerID]
    );



    res.json(rows);
  } catch (err) {
    console.error("Error fetching past lands for landowner:", err);
    res.status(500).json({ error: "DB error" });
  }
}
