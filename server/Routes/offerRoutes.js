import express from "express";
import multer from "multer";
import { 
  getOffer, 
  addOffer, 
  updateOffer, 
  deleteOffer 
} from "../Controllers/offer.js";

import { getAllOffers } from "../Controllers/filterOffers.js"; 

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/getOffer/:offerID", getOffer);
router.post("/addOffer", upload.array("images", 10), addOffer);
router.put("/updateOffer/:offerID", upload.array("images", 10), updateOffer);
router.delete("/deleteOffer/:offerID", deleteOffer);

router.get("/offers", getAllOffers);

export default router;
