import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Badge,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FaChartLine, FaHistory, FaHeart, FaCalendarCheck } from "react-icons/fa";
import OfferCard from "./offerCard";
import "../style/Farmer_Dasboard.css";

export default function FarmerDashboard() {
  const [currentLands, setCurrentLands] = useState([]);
  const [pastLands, setPastLands] = useState([]);
  const [favoriteOffers, setFavoriteOffers] = useState([]);
  const [loading, setLoading] = useState({ current: true, past: true, favorites: true });
  const [error, setError] = useState(null);
  const [expandedSection, setExpandedSection] = useState('current');

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
      .catch(() => setCurrentLands([]))
      .finally(() => setLoading(prev => ({ ...prev, current: false })));
  }, []);

  // fetch past lands
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/farmer/past-lands`, { withCredentials: true })
      .then((res) => setPastLands(res.data))
      .catch(() => setPastLands([]))
      .finally(() => setLoading(prev => ({ ...prev, past: false })));
  }, []);

  // fetch favorite offers
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/FavoriteOffers`, { withCredentials: true })
      .then((res) => setFavoriteOffers(res.data))
      .catch(() => setFavoriteOffers([]))
      .finally(() => setLoading(prev => ({ ...prev, favorites: false })));
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
      setError("Failed to remove favorite offer. Please try again.");
      console.error("Failed to remove favorite:", err);
    }
  };

  const handleAccordionChange = (section) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? section : false);
  };

  const renderLoading = () => <div className="loading-container"><CircularProgress /></div>;
  const renderEmpty = (msg) => <div className="empty-state"><p>{msg}</p></div>;

  const stats = {
    currentLands: currentLands.length,
    pastLands: pastLands.length,
    favoriteOffers: favoriteOffers.length
  };

  const StatCard = ({ icon: Icon, title, value }) => (
    <div className="stat-card">
      <Icon className="stat-icon" />
      <div className="stat-content">
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <div className="dashboard-header">
        <h1>Farmer Dashboard</h1>
      </div>

      <div className="stats-grid">
        <StatCard icon={FaCalendarCheck} title="Current Lands" value={stats.currentLands} />
        <StatCard icon={FaHistory} title="Past Lands" value={stats.pastLands} />
        <StatCard icon={FaHeart} title="Favorite Offers" value={stats.favoriteOffers} />
      </div>

      <div className="spacer" />

      {/* Current Lands */}
      <Accordion expanded={expandedSection === 'current'} onChange={handleAccordionChange('current')} className="dashboard-section">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Badge badgeContent={stats.currentLands} color="primary">Current Lands</Badge>
        </AccordionSummary>
        <AccordionDetails>
          {loading.current ? renderLoading() : currentLands.length === 0 ? renderEmpty("No current lands.") : (
            <div className="land-cards">
              {currentLands.map((land) => (
                <Card className="land-card" key={land.id}>
                  <CardContent>
                    <Typography variant="h6" className="land-title">
                      {land.landTitle}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Owner:</strong> {land.landownerFirstName} {land.landownerLastName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Location:</strong> {land.landLocation}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Lease ends:</strong> {new Date(land.endDate).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </AccordionDetails>
      </Accordion>

      <div className="spacer" />

      {/* Past Lands */}
      <Accordion expanded={expandedSection === 'past'} onChange={handleAccordionChange('past')} className="dashboard-section">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Badge badgeContent={stats.pastLands} color="secondary">Past Lands</Badge>
        </AccordionSummary>
        <AccordionDetails>
          {loading.past ? renderLoading() : pastLands.length === 0 ? renderEmpty("No past lands.") : (
            <div className="land-cards">
              {pastLands.map((land) => (
                <Card className="land-card" key={land.id}>
                  <CardContent>
                    <Typography variant="h6" className="land-title">
                      {land.landTitle}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Location:</strong> {land.landLocation}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Worked on until:</strong> {new Date(land.endDate).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </AccordionDetails>
      </Accordion>

      <div className="spacer" />

      {/* Favorite Offers */}
      <Accordion expanded={expandedSection === 'favorites'} onChange={handleAccordionChange('favorites')} className="dashboard-section">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Badge badgeContent={stats.favoriteOffers} color="info">Favorite Offers</Badge>
        </AccordionSummary>
        <AccordionDetails>
          {loading.favorites ? renderLoading() : favoriteOffers.length === 0 ? renderEmpty("No favorite offers.") : (
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
        </AccordionDetails>
      </Accordion>
    </div>
  );
}