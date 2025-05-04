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
      .get("http://localhost:3001/farmer/current-lands", { withCredentials: true })
      .then((res) => {
        setCurrentLands(filterActive(res.data));
      })
      .catch(() => setCurrentLands([]));
  }, []);

  // fetch past lands (you might choose to show expired here, or leave it empty)
  useEffect(() => {
    axios
      .get("http://localhost:3001/farmer/past-lands", { withCredentials: true })
      .then((res) => setPastLands(res.data))
      .catch(() => setPastLands([]));
  }, []);

  // fetch favorite offers
  useEffect(() => {
    axios
      .get("http://localhost:3001/FavoriteOffers", { withCredentials: true })
      .then((res) => setFavoriteOffers(res.data))
      .catch(() => setFavoriteOffers([]));
  }, []);

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
                <strong>{dateLabel}:</strong>{" "}
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
            <div className="land-cards">
              {favoriteOffers.map((o) => (
                <Card className="land-card" key={o.id}>
                  <CardContent>
                    <Typography variant="h6" className="land-title">
                      {o.landTitle}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Price:</strong> {o.landLeasePrice}
                    </Typography>
                  </CardContent>
                </Card>
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
