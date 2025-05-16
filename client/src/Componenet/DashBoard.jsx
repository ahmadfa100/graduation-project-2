import React, { useEffect, useState } from "react";
import axios from "axios";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../style/DashBoard.css";

import OfferCard from "./offerCard";

export default function Dashboard() {
  const [myOffers, setMyOffers] = useState([]);
  const [favoriteOffers, setFavoriteOffers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeRentals, setActiveRentals] = useState([]);
  const navigate = useNavigate();

  // fetch “My Offers” as owner
  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/dashboard/offers`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setMyOffers)
      .catch(() => setMyOffers([]));
  }, []);

  // fetch “Favorite Offers”
  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/FavoriteOffers`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setFavoriteOffers)
      .catch(() => setFavoriteOffers([]));
  }, []);

  // fetch pending rental requests
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/dashboard/requests`, { withCredentials: true })
      .then((res) => setRequests(res.data))
      .catch(() => setRequests([]));
  }, []);

  // fetch lands currently rented out by owner
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/dashboard/active-rentals`, { withCredentials: true })
      .then((res) => setActiveRentals(res.data))
      .catch(() => setActiveRentals([]));
  }, []);

  // handler to REMOVE one favorite
  const handleRemoveFavorite = async (offerId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/DeleteFavoriteOffer`,
        { data: { offerID: offerId }, withCredentials: true }
      );
      setFavoriteOffers((prev) => prev.filter((o) => o.id !== offerId));
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }
  };

  // accept or reject rental request
  const handleRequestAction = async (requestId, action) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/dashboard/requests/${requestId}/${action}`,
        {},
        { withCredentials: true }
      );
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      console.error(`Failed to ${action} request`, err);
    }
  };

  return (
    <div className="dashboard">
      {/* — Add Offer button — */}
      <div className="dashboard-section top-row">
        <h2>Add Offer</h2>
        <button
          className="add-offer-button"
          onClick={() => navigate("/AddOffer")}
        >
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
                isFavorite
                onToggleFavorite={() => handleRemoveFavorite(offer.id)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="spacer" />

      {/* — Requested Lands Accordion — */}
      <Accordion className="dashboard-section">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Requested Lands
        </AccordionSummary>
        <AccordionDetails>
          {requests.length === 0 ? (
            <p>No pending requests.</p>
          ) : (
            <div className="requests-list">
              {requests.map((req) => (
                <div key={req.id} className="request-card">
                  <div className="request-content">
                    <h4 className="request-title">{req.landTitle}</h4>
                    <p className="request-farmer">
                      Farmer: {req.farmerFirstName} {req.farmerLastName} (age {req.farmerAge})
                    </p>
                  </div>
                  <div className="request-actions">
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleRequestAction(req.id, "accept")}
                    >
                      ACCEPT
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => handleRequestAction(req.id, "reject")}
                      className="reject-button"
                    >
                      REJECT
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AccordionDetails>
      </Accordion>

      <div className="spacer" />

      {/* — Active Rentals Accordion — */}
      <Accordion className="dashboard-section">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Active Rentals
        </AccordionSummary>
        <AccordionDetails>
          {activeRentals.length === 0 ? (
            <p>No lands currently rented out.</p>
          ) : (
            <div className="requests-list">
              {activeRentals.map((r) => (
                <div key={r.dealID} className="request-card">
                  <div className="request-content">
                    <h4 className="request-title">{r.landTitle}</h4>
                    <p>Farmer: {r.farmerFirstName} {r.farmerLastName}</p>
                    <p>
                      From: {new Date(r.startDate).toLocaleDateString()} — To: {new Date(r.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
