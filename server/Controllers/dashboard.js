import db from "../db.js";

export const getMyOffers = async (req, res) => {
  if (!req.session.user?.id) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const ownerID = req.session.user.id;

  try {
    const result = await db.query(
      `
      SELECT
        o.id,
        o.landtitle        AS "landTitle",
        o.landsize         AS "landSize",
        o.landlocation     AS "landLocation",
        o.offerdescription AS "offerDescription",
        o.landleaseprice   AS "landLeasePrice",
        o.leaseduration    AS "leaseDuration",
        o.ownerid          AS "ownerID",
        o.phonenumber      AS "phoneNumber",
        o.offerdate        AS "offerDate",
        -- grab one picture (base64‑encoded) or empty string
        COALESCE(
          ('data:image/jpeg;base64,' || encode(lp.picture, 'base64')),
          ''
        ) AS "image"
      FROM offers o
      LEFT JOIN LATERAL (
        SELECT picture
        FROM landpicture
        WHERE landid = o.id
        LIMIT 1
      ) lp ON true
      WHERE o.ownerid = $1
      ORDER BY o.offerdate DESC
      `,
      [ownerID]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching user offers:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
