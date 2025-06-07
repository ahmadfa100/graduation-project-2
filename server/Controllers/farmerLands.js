import db from "../db.js";

export async function getCurrentLands(req, res) {
  const farmerID = req.session.user?.id;
  if (!farmerID) return res.status(401).json({ error: "Not authenticated" });

  try {
    const { rows } = await db.query(
      `
      SELECT
        o.id                 AS "offerID",
        o.landtitle          AS "landTitle",
        o.landlocation       AS "landLocation",
        rd.end_date          AS "endDate",
        u.firstname          AS "landownerFirstName",
        u.lastname           AS "landownerLastName",
        -- land picture (first one)
        encode(lp.picture, 'base64')       AS "landPicture",
        -- landowner profile picture
        encode(u.pfp, 'base64')            AS "landownerPfp"
      FROM rentaldeals rd
      JOIN offers o
        ON o.id = rd.offerid
      JOIN users u
        ON u.id = o.ownerid
      LEFT JOIN (
        SELECT DISTINCT ON (landid) landid, picture
        FROM landpicture
        ORDER BY landid, id
      ) lp ON lp.landid = o.id
      WHERE rd.farmerid = $1
        AND rd.status = 'accepted'
      ORDER BY rd.end_date ASC;
      `,
      [farmerID]
    );

    const result = rows.map(row => ({
      offerID:            row.offerID,
      landTitle:          row.landTitle,
      landLocation:       row.landLocation,
      endDate:            row.endDate,
      landownerFirstName: row.landownerFirstName,
      landownerLastName:  row.landownerLastName,
      landImage: row.landPicture
        ? `data:image/jpeg;base64,${row.landPicture}`
        : null,
      landownerImage: row.landownerPfp
        ? `data:image/jpeg;base64,${row.landownerPfp}`
        : null,
    }));

    res.json(result);
  } catch (err) {
    console.error("Error fetching current lands:", err);
    res.status(500).json({ error: "DB error" });
  }
}

export async function getFarmerRequests(req, res) {
  const farmerID = req.session.user?.id;
  if (!farmerID) return res.status(401).json({ error: "Not authenticated" });

  try {
    const { rows } = await db.query(
      `
      SELECT 
        rd.id                            AS "id",
        rd.offerid                       AS "offerID",
        rd.status                        AS "status",
        o.landtitle                      AS "landTitle",
        u.firstname                      AS "ownerFirstName",
        u.lastname                       AS "ownerLastName",
        COALESCE(
          ('data:image/jpeg;base64,' || encode(lp.picture, 'base64')),
          ''
        )                                AS "landImage"
      FROM rentaldeals rd
      JOIN offers o ON o.id = rd.offerid
      JOIN users u ON u.id = rd.landownerid
      LEFT JOIN LATERAL (
        SELECT picture
        FROM landpicture
        WHERE landid = o.id
        LIMIT 1
      ) lp ON true
      WHERE rd.farmerid = $1
        AND rd.status = 'pending'
      ORDER BY rd.id DESC;
      `,
      [farmerID]
    );

    // simply pass rows through now that aliases match your JSX
    res.json(rows);
  } catch (err) {
    console.error("Error fetching farmer requests:", err);
    res.status(500).json({ error: "DB error" });
  }
}
