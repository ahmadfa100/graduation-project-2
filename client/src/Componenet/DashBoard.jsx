import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FaPlus } from "react-icons/fa";
import "../style/DashBoard.css";

function LandownerDashboard() {
  const [offers, setOffers] = useState([]);
  const [favoriteOffers, setFavoriteOffers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/dashboard/offers", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Not authorized or error fetching offers");
        }
        return res.json();
      })
      .then((data) => {
        setOffers(data);
      })
      .catch((error) => {
        console.error("Error fetching dashboard offers:", error);
      });
  }, []);

  // Toggle the offer in the favorites list
  const toggleFavorite = (offerId) => {
    setFavoriteOffers((prevFavorites) =>
      prevFavorites.includes(offerId)
        ? prevFavorites.filter((id) => id !== offerId)
        : [...prevFavorites, offerId]
    );
  };

  // Filter favorites based on current list of offers
  const favoriteOffersList = offers.filter((offer) =>
    favoriteOffers.includes(offer.id)
  );

  return (
    <div className="dashboard">
      {/* Add Offer Section */}
      <div className="dashboard-section">
        <h2>Add Offer</h2>
        <div className="inner-content">
          <button className="add-offer-button" aria-label="Add Offer">
            <FaPlus />
          </button>
        </div>
      </div>

      {/* Spacer between sections */}
      <div className="spacer"></div>

      {/* My Offers Section */}
      <Accordion className="dashboard-section">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          My Offers
        </AccordionSummary>
        <AccordionDetails style={{ display: "block" }}>
          {offers.length > 0 ? (
            offers.map((offer) => (
              <div key={offer.id} className="offer">
                <h3>{offer.landTitle}</h3>
                <p>Status: {offer.status || "Available"}</p>
                <p>Views: {offer.views || 0}</p>
                <button
                  className="favorite-toggle-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(offer.id);
                  }}
                >
                  {favoriteOffers.includes(offer.id)
                    ? "Remove Favorite"
                    : "Add Favorite"}
                </button>
              </div>
            ))
          ) : (
            <p>No offers found.</p>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Spacer between sections */}
      <div className="spacer"></div>

      {/* Favorite Offers Section */}
      <div className="dashboard-section">
        <h2>Favorite Offers</h2>
        <div className="inner-content">
          {favoriteOffersList.length > 0 ? (
            favoriteOffersList.map((offer) => (
              <div key={offer.id} className="offer">
                <h3>{offer.landTitle}</h3>
                <p>Status: {offer.status || "Available"}</p>
                <p>Views: {offer.views || 0}</p>
                <button
                  className="favorite-toggle-button"
                  onClick={() => toggleFavorite(offer.id)}
                >
                  Remove Favorite
                </button>
              </div>
            ))
          ) : (
            <p>No favorite offers found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LandownerDashboard;
