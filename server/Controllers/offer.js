import db from "../db.js";

export const getOffer = async (req, res) => {
  try {
    const offerID = req.params.offerID;
    const offerinfo = await db.query("SELECT * FROM offers WHERE id = $1", [offerID]);
    
    if (offerinfo.rowCount === 0) {
      return res.status(404).json({ error: "Offer not found" });
    }

    const offerimages = await db.query("SELECT picture FROM landPicture WHERE landID = $1", [offerID]);
    const images = offerimages.rows.map((row) =>
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
    const { offer_title, size, years, months, price, location, description, landOwnerID } = req.body;
    if (!offer_title || !size || !location || !description || !price || !years || !months || !landOwnerID) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const leaseDuration = parseInt(years) * 12 + parseInt(months);
    const values = [offer_title, parseFloat(size), location, description, parseFloat(price), leaseDuration, parseInt(landOwnerID)];
    
    const addOfferResponse = await db.query(
      "INSERT INTO offers (landTitle, landSize, landLocation, offerDescription, landLeasePrice, leaseDuration, OwnerID) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values
    );
    
    const offerId = addOfferResponse.rows[0].id;
    // Save uploaded images
    req.files.forEach(async (file) => {
      await db.query("INSERT INTO landPicture (landID, picture) VALUES ($1, $2)", [offerId, file.buffer]);
    });
    
    res.json({ message: "Offer added successfully", offerId });
  } catch (error) {
    console.error("Error adding offer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PUT /updateOffer/:offerID
export const updateOffer = async (req, res) => {
  try {
    const { offer_title, size, years, months, price, location, description, landOwnerID } = req.body;
    const { offerID } = req.params;

    if (!offerID || !offer_title || !size || !location || !description || !price || !years || !months || !landOwnerID) {
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
    
    // Delete images associated with the offer
    await db.query("DELETE FROM landPicture WHERE landID = $1", [offerID]);
    
    const deleteOfferResponse = await db.query("DELETE FROM offers WHERE id = $1 RETURNING landTitle", [offerID]);
    if (deleteOfferResponse.rows.length === 0) {
      return res.status(404).json({ error: "Offer not found" });
    }
    
    res.json({ message: "Offer deleted successfully", landTitle: deleteOfferResponse.rows[0].landTitle });
  } catch (error) {
    console.error("Error deleting offer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
