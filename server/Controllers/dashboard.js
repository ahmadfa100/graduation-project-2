// Controllers/dashboard.js
import db from "../db.js";

export const getMyOffers = async (req, res) => {
  if (!req.session.user?.id) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const ownerID = req.session.user.id;
  try {
    const result = await db.query(
      `
      SELECT o.*,
             COALESCE(
               ('data:image/jpeg;base64,' || encode(lp.picture, 'base64')),
               ''
             ) AS image
      FROM offers o
      LEFT JOIN LATERAL (
        SELECT picture FROM landPicture WHERE landID = o.id LIMIT 1
      ) lp ON true
      WHERE o.OwnerID = $1
      ORDER BY o.offerDate DESC
      `,
      [ownerID]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching user offers:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
