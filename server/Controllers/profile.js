import db from "../db.js";

// GET /api/profile - user info
export const getProfile = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const dbase = await db.query(
      `SELECT firstname, lastname, encode(pfp, 'base64') AS profileimage, created_at
       FROM users 
       WHERE id = $1`,
      [req.session.user.id]
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
      bio: '', // You can add a bio field if you have it
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};

// GET /api/profile/stats - user stats
export const getProfileStats = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = req.session.user.id;

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
    , [userId]);
    console.log(result.rows[0]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user stats" });
  }
};

export const getRentedOffers = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = req.session.user.ID;

  try {
    const result = await db.query(
      `SELECT offerID FROM rentaldeals WHERE farmerID = $1 AND status = 'accepted';
`,
      [userId]
    );
    console.log("rented offers",result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch rented offers" });
  }
};
