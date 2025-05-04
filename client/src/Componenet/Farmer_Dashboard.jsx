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
import "../style/Farmer_Dasboard.css"; // adjust path/filename if needed

export default function FarmerDashboard() {
  const [currentLands, setCurrentLands] = useState([]);
  const [pastLands, setPastLands] = useState([]);
  const [favoriteOffers, setFavoriteOffers] = useState([]);

  // fetch current lands
  useEffect(() => {
    axios
      .get("http://localhost:3001/farmer/current-lands", { withCredentials: true })
      .then(res => setCurrentLands(res.data))
      .catch(() => setCurrentLands([]));
  }, []);

  // fetch past lands
  useEffect(() => {
    axios
      .get("http://localhost:3001/farmer/past-lands", { withCredentials: true })
      .then(res => setPastLands(res.data))
      .catch(() => setPastLands([]));
  }, []);

  // fetch favorite offers
  useEffect(() => {
    axios
      .get("http://localhost:3001/FavoriteOffers", { withCredentials: true })
      .then(res => setFavoriteOffers(res.data))
      .catch(() => setFavoriteOffers([]));
  }, []);

  const renderLands = (lands, emptyMessage, includeOwner = false) => {
    if (lands.length === 0) {
      return <Typography>{emptyMessage}</Typography>;
    }
    return (
      <div className="land-cards">
        {lands.map(land => (
          <Card className="land-card" key={land.id}>
            <CardContent>
              <Typography variant="h6" className="land-title">
                {land.landTitle}
              </Typography>
              {includeOwner && (
                <Typography variant="body2">
                  <strong>Owner:</strong> {land.landownerFirstName}{" "}
                  {land.landownerLastName}
                </Typography>
              )}
              <Typography variant="body2">
                <strong>Location:</strong> {land.landLocation}
              </Typography>
              <Typography variant="body2">
                <strong>
                  {includeOwner ? "Lease ends:" : "Worked on until:"}
                </strong>{" "}
                {new Date(land.endDate).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="farmer-dashboard">
      <h1>Farmer Dashboard</h1>

      <Accordion className="section">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Current Lands
        </AccordionSummary>
        <AccordionDetails>
          {renderLands(currentLands, "No current lands.", true)}
        </AccordionDetails>
      </Accordion>

      <Accordion className="section">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Past Lands
        </AccordionSummary>
        <AccordionDetails>
          {renderLands(pastLands, "No past lands.")}
        </AccordionDetails>
      </Accordion>

      <Accordion className="section">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Favorite Offers
        </AccordionSummary>
        <AccordionDetails>
          {favoriteOffers.length > 0 ? (
            <div className="land-cards">
              {favoriteOffers.map(offer => (
                <Card className="land-card" key={offer.id}>
                  <CardContent>
                    <Typography variant="h6" className="land-title">
                      {offer.landTitle}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Price:</strong> {offer.landLeasePrice}
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
