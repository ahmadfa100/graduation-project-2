import React, { useEffect, useState } from "react";
import axios from "axios";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FaLeaf } from "react-icons/fa";
import "../style/Farmer_Dasboard.css";

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

  return (
    <div className="farmer-dashboard">
      <h1>Farmer Dashboard</h1>

      <Accordion className="section">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>Current Lands</AccordionSummary>
        <AccordionDetails>
          {currentLands.length > 0 ? (
            <ul className="land-list">
              {currentLands.map(land => (
                <li key={land.id}>
                  <h3>{land.landTitle}</h3>
                  <p>Location: {land.landLocation}</p>
                  <p>Lease ends: {new Date(land.endDate).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No current lands.</p>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion className="section">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>Past Lands</AccordionSummary>
        <AccordionDetails>
          {pastLands.length > 0 ? (
            <ul className="land-list">
              {pastLands.map(land => (
                <li key={land.id}>
                  <h3>{land.landTitle}</h3>
                  <p>Location: {land.landLocation}</p>
                  <p>Worked on until: {new Date(land.endDate).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No past lands.</p>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion className="section">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>Favorite Offers</AccordionSummary>
        <AccordionDetails>
          {favoriteOffers.length > 0 ? (
            <ul className="land-list">
              {favoriteOffers.map(offer => (
                <li key={offer.id}>
                  <h3>{offer.landTitle}</h3>
                  <p>Price: {offer.landLeasePrice}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No favorite offers.</p>
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
