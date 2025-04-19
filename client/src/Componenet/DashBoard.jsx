// src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../style/offer.css";

import OfferCard from "./offerCard";
import "../style/DashBoard.css";

export default function LandownerDashboard() {
  const [offers, setOffers] = useState([]);
  const [favoriteOffers, setFavoriteOffers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/dashboard/offers", {
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error("Not authorized");
        return res.json();
      })
      .then(setOffers)
      .catch(console.error);
  }, []);

  const toggleFavorite = id =>
    setFavoriteOffers(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  const favoriteList = offers.filter(o => favoriteOffers.includes(o.id));

  return (
    <div className="dashboard">
      <div className="dashboard-section">
        <h2>Add Offer</h2>
        <div className="inner-content">
          <button
            className="add-offer-button"
            onClick={() => navigate("/AddOffer")}
          >
            <FaPlus />
          </button>
        </div>
      </div>

      <div className="spacer" />

      <Accordion className="dashboard-section">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          My Offers
        </AccordionSummary>
        <AccordionDetails>
          {offers.length === 0 ? (
            <p>No offers found.</p>
          ) : (
            <div className="offers-list">
              {offers.map(offer => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  isFavorite={favoriteOffers.includes(offer.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
        </AccordionDetails>
      </Accordion>

      <div className="spacer" />

      <div className="dashboard-section">
        <h2>Favorite Offers</h2>
        <div className="inner-content">
          {favoriteList.length === 0 ? (
            <p>No favorite offers found.</p>
          ) : (
            <div className="offers-list">
              {favoriteList.map(offer => (
                <OfferCard
  key={offer.id}
  offer={offer}
  isFavorite={favoriteOffers.includes(offer.id)}
  onToggleFavorite={toggleFavorite}
/>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
