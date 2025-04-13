import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FaEye, FaPlus } from "react-icons/fa";
import "../style/DashBoard.css";

function LandownerDashboard() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/dashboard/offers", {
      credentials: "include", // ensures cookies are sent
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

  return (
    <div className="dashboard">
      <div className="top-row">
        <div className="dashboard-section">
          <h2>Number of Views</h2>
          <div className="inner-content">
            <div className="views-number">
              <FaEye /> 1234
            </div>
          </div>
        </div>
        <div className="dashboard-section">
          <h2>Add Offer</h2>
          <div className="inner-content">
            <button className="add-offer-button" aria-label="Add Offer">
              <FaPlus />
            </button>
          </div>
        </div>
      </div>
      <Accordion>
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
              </div>
            ))
          ) : (
            <p>No offers found.</p>
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default LandownerDashboard;