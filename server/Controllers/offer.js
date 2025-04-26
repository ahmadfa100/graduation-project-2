import db from "../db.js";

// GET /getOffer/:offerID
export const getOffer = async (req, res) => {
  try {
    const offerID = req.params.offerID;
    console.log("offerID0 :",offerID);
    const offerinfo = await db.query("SELECT * FROM offers WHERE id = $1", [offerID]);
    if (offerinfo.rowCount === 0) {
      return res.status(404).json({ error: "Offer not found" });
    }
    const offerimages = await db.query(
      "SELECT picture FROM landPicture WHERE landID = $1",
      [offerID]
    );
    const images = offerimages.rows.map(row =>
      `data:image/jpeg;base64,${row.picture.toString("base64")}`
    );
    res.json({ offer: offerinfo.rows[0], images });
  } catch (err) {
    console.error("Error fetching offer:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const addOffer = async (req, res) => {
  try {
 
    if (!req.session.user?.id) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const landOwnerID = req.session.user.id;
    const phoneNumber = req.session.user.phonenumber;
    const { offer_title, size, years, months, price, location, description } = req.body;
    //console.log(phoneNumber);
    if (
      !phoneNumber||
      !offer_title ||
      !size ||
      !years ||
      !months ||
      !price ||
      !location ||
      !description
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const leaseDuration = parseInt(years) * 12 + parseInt(months);
    await db.query(
      "INSERT INTO Landowners (ID) VALUES ($1) ON CONFLICT (ID) DO NOTHING",
      [landOwnerID]
    );

    const addOfferResponse = await db.query(
      `INSERT INTO offers
         (landTitle, landSize, landLocation, offerDescription, landLeasePrice, leaseDuration, OwnerID,phoneNumber)
       VALUES ($1, $2, $3, $4, $5, $6, $7,$8)
       RETURNING id`,
      [
        offer_title,
        parseFloat(size),
        location,
        description,
        parseFloat(price),
        leaseDuration,
        landOwnerID,
        phoneNumber
      ]
    );
    const offerId = addOfferResponse.rows[0].id;

  
    for (const file of req.files) {
      await db.query(
        "INSERT INTO landPicture (landID, picture) VALUES ($1, $2)",
        [offerId, file.buffer]
      );
    }

    res.json({ message: "Offer added successfully", offerId });
  } catch (error) {
    console.error("Error adding offer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateOffer = async (req, res) => {
  if (!req.session.user?.id) {    
    console.log("Not authenticated ):" );
   return res.status(401).json({ error: "Not authenticated" });
 }
  try {
    const { offer_title, size, years, months, price, location, description } = req.body;
    const { offerID } = req.params;
    const landOwnerID =req.session.user.id;
    if (!offerID || !offer_title || !size || !location || !description || !price || !years || !months ) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const leaseDuration = parseInt(years) * 12 + parseInt(months);
    const values = [offer_title, parseFloat(size), location, description, parseFloat(price), leaseDuration, parseInt(landOwnerID), parseInt(offerID)];
    
    const updateOfferResponse = await db.query(
      "UPDATE offers SET landTitle = $1, landSize = $2, landLocation = $3, offerDescription = $4, landLeasePrice = $5, leaseDuration = $6, OwnerID = $7 WHERE id = $8 RETURNING id",
      values
    );
    
    if (updateOfferResponse.rowCount === 0) {
      return res.status(404).json({ error: "Offer not found" });
    }
    
    // Remove old images and add the new ones
    await db.query("DELETE FROM landPicture WHERE landID = $1", [offerID]);
    for (const file of req.files) {
      await db.query("INSERT INTO landPicture (landID, picture) VALUES ($1, $2)", [offerID, file.buffer]);
    }
    
    res.json({ message: "Offer updated successfully", offerId: updateOfferResponse.rows[0].id });
  } catch (error) {
    console.error("Error updating offer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// DELETE /deleteOffer/:offerID
export const deleteOffer = async (req, res) => {
  try {
    const { offerID } = req.params;
    await db.query("DELETE FROM landPicture WHERE landID = $1", [offerID]);
    const deleteRes = await db.query(
      "DELETE FROM offers WHERE id = $1 RETURNING landTitle",
      [offerID]
    );
    if (deleteRes.rowCount === 0) {
      return res.status(404).json({ error: "Offer not found" });
    }
    res.json({ message: "Offer deleted successfully", landTitle: deleteRes.rows[0].landTitle });
  } catch (error) {
    console.error("Error deleting offer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET /offers (filtering offers)
export const getAllOffers = async (req, res) => {
  try {
    const { search, city, period, space } = req.query;
    const limit = parseInt(req.query.limit) || 3;    
    const offset = parseInt(req.query.offset) || 0;    

    let baseQuery = `
      SELECT o.*, COALESCE(('data:image/jpeg;base64,' || encode(lp.picture, 'base64')), '') AS image
      FROM offers o
      LEFT JOIN LATERAL (
        SELECT picture FROM landPicture WHERE landID = o.id LIMIT 1
      ) lp ON true
      WHERE 1=1
    `;
    const values = [];
    let paramIndex = 1;

    if (search) {
      baseQuery += ` AND o.landTitle ILIKE $${paramIndex}`;
      values.push(`%${search}%`);
      paramIndex++;
    }

    if (city) {
      baseQuery += ` AND o.landLocation ILIKE $${paramIndex}`;
      values.push(`%${city}%`);
      paramIndex++;
    }

    // Filtering by period: assume "monthly" means leaseDuration less than 12, and "yearly" means 12 or more.
    if (period) {
      if (period.toLowerCase() === "monthly") {
        baseQuery += ` AND o.leaseDuration < $${paramIndex}`;
        values.push(12);
      } else if (period.toLowerCase() === "yearly") {
        baseQuery += ` AND o.leaseDuration >= $${paramIndex}`;
        values.push(12);
      }
      paramIndex++;
    }

    if (space) {
      baseQuery += ` AND o.landSize >= $${paramIndex}`;
      values.push(Number(space));
      paramIndex++;
    }

    baseQuery += ` ORDER BY o.id DESC LIMIT $${paramIndex}`;
    values.push(limit);
    paramIndex++;

    baseQuery += ` OFFSET $${paramIndex}`;
    values.push(offset);

    const result = await db.query(baseQuery, values);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching filtered offers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
