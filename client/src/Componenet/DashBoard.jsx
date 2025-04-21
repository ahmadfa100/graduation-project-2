
import React, { useEffect, useState } from "react";
import axios from "axios";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../style/DashBoard.css";

import OfferCard from "./offerCard";

export default function Dashboard() {
  const [myOffers, setMyOffers] = useState([]);
  const [favoriteOffers, setFavoriteOffers] = useState([]);
  const navigate = useNavigate();

  // fetch “My Offers” as owner
  useEffect(() => {
    fetch("http://localhost:3001/dashboard/offers", { credentials: "include" })
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then(setMyOffers)
      .catch(() => setMyOffers([]));
  }, []);

  // fetch “Favorite Offers”
  useEffect(() => {
    fetch("http://localhost:3001/FavoriteOffers", { credentials: "include" })
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then(setFavoriteOffers)
      .catch(() => setFavoriteOffers([]));
  }, []);

  // handler to REMOVE one favorite
  const handleRemoveFavorite = async (offerId) => {
    try {
      await axios.delete(
        "http://localhost:3001/DeleteFavoriteOffer",
        {
          data: { offerID: offerId },
          withCredentials: true,
        }
      );
      // drop it from local state so the UI re‐renders
      setFavoriteOffers((prev) => prev.filter((o) => o.id !== offerId));
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }
  };

  return (
    <div className="dashboard">
      {/* — Add Offer button — */}
      <div className="dashboard-section">
        <h2>Add Offer</h2>
        <button className="add-offer-button" onClick={() => navigate("/AddOffer")}>
          <FaPlus />
        </button>
      </div>

      <div className="spacer" />

      {/* — My Offers Accordion — */}
      <Accordion className="dashboard-section">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          My Offers
        </AccordionSummary>
        <AccordionDetails>
          {myOffers.length === 0 ? (
            <p>No offers found.</p>
          ) : (
            <div className="offers-list">
              {myOffers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  showEdit
                  onEdit={(id) => navigate(`/updateOffer/${id}`)}
                />
              ))}
            </div>
          )}
        </AccordionDetails>
      </Accordion>

      <div className="spacer" />

      {/* — Favorite Offers — */}
      <div className="dashboard-section">
        <h2>Favorite Offers</h2>
        {favoriteOffers.length === 0 ? (
          <p>No favorite offers found.</p>
        ) : (
          <div className="offers-list">
            {favoriteOffers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                // Tell OfferCard “this one is favorited”
                isFavorite={true}
                // And give it a callback for “un-favorite”
                onToggleFavorite={() => handleRemoveFavorite(offer.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}