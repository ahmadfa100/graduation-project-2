// server/Controllers/fav.js
import db from "../db.js";

// GET /FavoriteOffers
export const getFav = async (req, res) => {
  const userID = req.session?.user?.id;
  const { offerID } = req.query;

  if (!userID) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    if (offerID) {
      // Check if a specific offer is favorited by the user
      const result = await db.query(
        `SELECT *
         FROM FavoriteOffers
         WHERE offerID = $1
           AND farmerID = $2`,
        [offerID, userID]
      );
      return res.status(200).json(result.rows);
    } else {
      // Return detailed list of all favorite offers
      const result = await db.query(
        `
        SELECT
          o.id,
          o.landtitle         AS "landTitle",
          o.landsize          AS "landSize",
          o.landlocation      AS "landLocation",
          o.offerdescription  AS "offerDescription",
          o.landleaseprice    AS "landLeasePrice",
          o.phonenumber       AS "phoneNumber",
          COALESCE(
            ('data:image/jpeg;base64,' || encode(lp.picture, 'base64')),
            ''
          ) AS "image"
        FROM favoriteoffers f
        JOIN offers o
          ON f.offerid = o.id
        LEFT JOIN LATERAL (
          SELECT picture
          FROM landpicture
          WHERE landid = o.id
          LIMIT 1
        ) lp ON true
        WHERE f.farmerid = $1
        ORDER BY o.id DESC
        `,
        [userID]
      );
      return res.status(200).json(result.rows);
    }
  } catch (error) {
    console.error("Error fetching favorite offers:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// POST /AddFavoriteOffers
export const AddFavoriteOffers = async (req, res) => {
  if (!req.session.user?.id) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const { offerID } = req.body;
  if (!offerID) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const userID = req.session.user.id;

  try {
    await db.query(
      `INSERT INTO favoriteoffers (farmerid, offerid)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
      [userID, offerID]
    );
    return res.status(200).json({ message: "Favorite offer added successfully" });
  } catch (err) {
    console.error("Error adding favorite offer:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE /DeleteFavoriteOffer
export const DeleteFavoriteOffer = async (req, res) => {
  if (!req.session.user?.id) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const { offerID } = req.body;
  if (!offerID) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const userID = req.session.user.id;

  try {
    await db.query(
      `DELETE FROM favoriteoffers
       WHERE farmerid = $1
         AND offerid = $2`,
      [userID, offerID]
    );
    return res.status(200).json({ message: "Favorite offer deleted successfully" });
  } catch (err) {
    console.error("Error deleting favorite offer:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
