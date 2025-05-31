import db from "../db.js";

// GET /api/profile - user info
export const getProfile = async (req, res) => {
  let userID = parseInt(req.params.userID,10);
 
  if(isNaN(userID)){
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    console.log("session params");
    userID = req.session.user.id;
  }
 
  try {
    const dbase = await db.query(
      `SELECT firstname, lastname, email, phonenumber, gender, address, age, encode(pfp, 'base64') AS profileimage, created_at
       FROM users 
       WHERE id = $1`,
      [userID]
    );
    if (dbase.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = dbase.rows[0];
    res.json({
      name: `${user.firstname} ${user.lastname}`,
      email: user.email,
      phone: user.phonenumber,
      gender: user.gender,
      address: user.address,
      age: user.age,
      avatar: user.profileimage ? `data:image/png;base64,${user.profileimage}` : null,
      joinDate: user.created_at ? new Date(user.created_at).toLocaleDateString() : '',
      bio: '', 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};

export const getProfileStats = async (req, res) => {
  let userID = parseInt(req.params.userID);
 
  if(isNaN(userID)){
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    userID = req.session.user.id;
  }
  try {
    const result = await db.query(
      `
      WITH 
      -- Count all rental deals where user is a landowner or farmer
      total_deals AS (
        SELECT COUNT(*) AS count
        FROM RentalDeals
        WHERE landownerID = $1 OR farmerID = $1
      ),
      -- Count only accepted rental deals
      completed_deals AS (
        SELECT COUNT(*) AS count
        FROM RentalDeals
        WHERE (landownerID = $1 OR farmerID = $1) AND status = 'accepted'
      ),
      -- Count active offers by user (only if they're a landowner)
      active_offers AS (
        SELECT COUNT(*) AS count
        FROM Offers o
        JOIN Landowners l ON o.OwnerID = l.ID
        WHERE l.ID = $1 AND o.isReserved = FALSE
      )
      SELECT
        td.count AS total_deals,
        ao.count AS active_offers,
        cd.count AS completed_deals,
        CASE 
          WHEN td.count = 0 THEN 0
          ELSE ROUND((cd.count::decimal / td.count) * 100)
        END AS success_rate
      FROM total_deals td, completed_deals cd, active_offers ao
      `
    , [userID]);
    console.log(result.rows[0]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user stats" });
  }
};

export const getRentedOffers = async (req, res) => {

   let userID = parseInt(req.params.userID);
 
  if(isNaN(userID)){
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    userID = req.session.user.id;
  }

  try {
    const { rows } = await db.query(
      `SELECT
        o.id                 AS "offerID",
        o.landtitle          AS "landTitle",
        o.landlocation       AS "landLocation",
        rd.end_date          AS "endDate",
        u.firstname          AS "landownerFirstName",
        u.lastname           AS "landownerLastName",
        encode(lp.picture, 'base64') AS "landPicture"
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
      [userID]
    );

    const result = rows.map(row => ({
      ...row,
      landPicture: row.landPicture
        ? `data:image/jpeg;base64,${row.landPicture}`
        : null,
    }));
    res.json(result);
  } catch (err) {
    console.error("Error fetching current lands:", err);
    res.status(500).json({ error: "DB error" });
  }
};

export const getUserOffers = async (req, res) => {
  let userID = parseInt(req.params.userID);
 
  if(isNaN(userID)){
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    userID = req.session.user.id;
  }
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
      [userID]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching user offers:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};