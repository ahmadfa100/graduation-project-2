import db from "../db.js";

// GET /dashboard/requests
export async function getRequests(req, res) {
  const ownerID = req.session.user?.id;
  if (!ownerID) return res.status(401).json({ error: "Not authenticated" });

  try {
    const result = await db.query(
      `SELECT 
         rd.id,
         rd.offerid      AS "offerID",
         rd.farmerid     AS "farmerID",
         rd.status,
         o.landtitle     AS "landTitle",
         u.firstname     AS "farmerFirstName",
         u.lastname      AS "farmerLastName",
         u.age           AS "farmerAge",
         u.phonenumber   AS "farmerPhone"
       FROM rentaldeals rd
       JOIN offers o ON o.id = rd.offerid
       JOIN users u  ON u.id = rd.farmerid
       WHERE rd.landownerid = $1
         AND rd.status = 'pending'
       ORDER BY rd.id DESC`,
      [ownerID]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).json({ error: "DB error" });
  }
}

// POST /dashboard/requests/:id/accept
export async function acceptRequest(req, res) {
  const ownerID = req.session.user?.id;
  if (!ownerID) return res.status(401).json({ error: "Not authenticated" });
  const { id } = req.params;

  try {
    await db.query(
      `UPDATE rentaldeals rd
         SET status     = 'accepted',
             start_date = NOW(),
             end_date   = NOW() + (o.leaseduration * INTERVAL '1 month')
       FROM offers o
       WHERE rd.offerid     = o.id
         AND rd.id          = $1
         AND rd.landownerid = $2`,
      [id, ownerID]
    );
    res.json({ message: "Request accepted" });
  } catch (err) {
    console.error("Error accepting request:", err);
    res.status(500).json({ error: "DB error" });
  }
}

// POST /dashboard/requests/:id/reject
export async function rejectRequest(req, res) {
  const ownerID = req.session.user?.id;
  if (!ownerID) return res.status(401).json({ error: "Not authenticated" });
  const { id } = req.params;

  try {
    await db.query(
      `UPDATE rentaldeals
         SET status = 'rejected'
       WHERE id = $1
         AND landownerid = $2`,
      [id, ownerID]
    );
    res.json({ message: "Request rejected" });
  } catch (err) {
    console.error("Error rejecting request:", err);
    res.status(500).json({ error: "DB error" });
  }
}
export const rentRequest=async (req, res) => {
  try {
    if (!req.session.user?.id) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const farmerID = req.session.user.id;
     const {landOwner,offerID}=req.body;
    
    if (!offerID ||!landOwner ) {
      return res.status(400).json({ error: 'offerID and landownerID are required.' });
    }

await db.query("INSERT INTO Farmers (ID) VALUES ($1) ON CONFLICT DO NOTHING" ,[farmerID]);

    const values = [offerID, landOwner, farmerID];
console.log("values:",values);
      await db.query(`  INSERT INTO RentalDeals (offerID, landownerID, farmerID)    VALUES ($1, $2, $3) `, values);
    res.status(201).json({ message: 'Rental deal created successfully.' });
    console.log('Rental deal created successfully.');
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Rental deal already exists.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}