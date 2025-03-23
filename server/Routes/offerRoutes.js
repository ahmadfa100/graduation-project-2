import express from "express";
import { getAllOffers } from "../Controllers/filterOffers.js"; 

const router = express.Router();

router.get("/", getAllOffers);

export default router;
