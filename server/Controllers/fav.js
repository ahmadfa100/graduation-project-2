import db from "../db.js";
export const getFav= async (req, res) => {
    console.log("getfav");
 
  const {offerID}=req.query;
  if (!req.session.user?.id) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const userID = req?.session?.user?.id;
    if(!offerID){
      const result = await db.query("SELECT * FROM FavoriteOffers WHERE farmerID=($1)",[userID]);
     //console.log("ttt");
     //console.log("rows: ",result.rows);
      return res.status(200).json(result.rows);
    }
    if (!req.session.user?.id) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const result = await db.query("SELECT * FROM FavoriteOffers WHERE offerID=($1) AND farmerID=($2)",[offerID,userID]);
     res.json(result.rows);
    } catch (error) {
      console.error("Error fetching favorite offers:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  
  export const AddFavoriteOffers =async (req, res) => {
    
    const { offerID } = req.body; 
    if (!req.session.user?.id) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    //console.log(userID, "///", offerID);
  
    if ( !offerID) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const userID = req?.session?.user?.id;
  
    try {
      await db.query(
        "INSERT INTO FavoriteOffers (farmerID, offerID) VALUES ($1, $2) ON CONFLICT DO NOTHING",
        [userID, offerID] 
      );
      res.status(200).json({ message: "Favorite offer added successfully" });
      console.log("Successfully added to favorite offer");
    } catch (error) {
      console.error("Error adding favorite offer:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  export const DeleteFavoriteOffer= async (req, res) => {
   // console.log("kkkk :", req.session.user.id);
  
    const { offerID } = req.body;
    if (!req.session.user?.id) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    if ( !offerID) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const userID = req?.session?.user?.id;
  
    try {
      await db.query(
        "DELETE FROM FavoriteOffers WHERE farmerID = $1 AND offerID = $2",
        [userID, offerID]
      );
      res.status(200).json({ message: "Favorite offer deleted successfully" });
      console.log("Successfully deleted from favorite offer");
    } catch (error) {
      console.error("Error deleting favorite offer:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  