import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OfferCard from "./offerCard";
import "../style/Farmer_Dasboard.css";

export default function FarmerDashboard() {
  const [currentLands, setCurrentLands] = useState([]);
  const [pastLands, setPastLands] = useState([]);
  const [favoriteOffers, setFavoriteOffers] = useState([]);

  // helper to strip out expired leases
  const filterActive = (lands) => {
    const now = Date.now();
    return lands.filter((l) => new Date(l.endDate).getTime() > now);
  };

  // fetch current lands, then drop any that are expired
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/farmer/current-lands`, { withCredentials: true })
      .then((res) => setCurrentLands(filterActive(res.data)))
      .catch(() => setCurrentLands([]));
  }, []);

  // fetch past lands
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/farmer/past-lands`, { withCredentials: true })
      .then((res) => setPastLands(res.data))
      .catch(() => setPastLands([]));
  }, []);

  // fetch favorite offers
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/FavoriteOffers`, { withCredentials: true })
      .then((res) => setFavoriteOffers(res.data))
      .catch(() => setFavoriteOffers([]));
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

  const renderCards = (items, emptyText, includeOwner = false, dateLabel = "Lease ends") =>
    items.length ? (
      <div className="land-cards">
        {items.map((i) => (
          <Card className="land-card" key={i.id}>
            <CardContent>
              <Typography variant="h6" className="land-title">
                {i.landTitle}
              </Typography>
              {includeOwner && (
                <Typography variant="body2">
                  <strong>Owner:</strong> {i.landownerFirstName} {i.landownerLastName}
                </Typography>
              )}
              <Typography variant="body2">
                <strong>Location:</strong> {i.landLocation}
              </Typography>
              <Typography variant="body2">
                <strong>{dateLabel}:</strong> {" "}
                {new Date(i.endDate).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      <Typography>{emptyText}</Typography>
    );

  return (
    <div className="farmer-dashboard">
      <h1>Farmer Dashboard</h1>

      <Accordion className="section">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Current Lands
        </AccordionSummary>
        <AccordionDetails>
          {renderCards(currentLands, "No current lands.", true, "Lease ends")}
        </AccordionDetails>
      </Accordion>

      <Accordion className="section">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Past Lands
        </AccordionSummary>
        <AccordionDetails>
          {renderCards(pastLands, "No past lands.", false, "Worked on until")}
        </AccordionDetails>
      </Accordion>

      <Accordion className="section">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Favorite Offers
        </AccordionSummary>
        <AccordionDetails>
          {favoriteOffers.length ? (
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
          ) : (
            <Typography>No favorite offers.</Typography>
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}