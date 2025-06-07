import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Badge,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FaCalendarCheck, FaInbox, FaHeart } from "react-icons/fa";
import OfferCard from "./offerCard";
import UserAvatar from "../layout/userAvatar";  
import "../style/Farmer_Dasboard.css";

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const [currentLands, setCurrentLands] = useState([]);
  const [favoriteOffers, setFavoriteOffers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState({
    current: true,
    favorites: true,
    requests: true,
  });
  const [error, setError] = useState(null);
  const [expandedSection, setExpandedSection] = useState("current");

  const filterActive = (lands) => {
    const now = Date.now();
    return lands.filter((l) => new Date(l.endDate).getTime() > now);
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/farmer/current-lands`, { withCredentials: true })
      .then((res) => setCurrentLands(filterActive(res.data)))
      .catch(() => setCurrentLands([]))
      .finally(() => setLoading((prev) => ({ ...prev, current: false })));
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/FavoriteOffers`, { withCredentials: true })
      .then((res) => setFavoriteOffers(res.data))
      .catch(() => setFavoriteOffers([]))
      .finally(() => setLoading((prev) => ({ ...prev, favorites: false })));
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/farmer/requests`, { withCredentials: true })
      .then((res) => setRequests(res.data))
      .catch(() => setRequests([]))
      .finally(() => setLoading((prev) => ({ ...prev, requests: false })));
  }, []);

  const handleRemoveFavorite = async (offerId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/DeleteFavoriteOffer`,
        { data: { offerID: offerId }, withCredentials: true }
      );
      setFavoriteOffers((prev) => prev.filter((o) => o.id !== offerId));
    } catch (err) {
      setError("Failed to remove favorite offer. Please try again.");
      console.error(err);
    }
  };

  const handleAccordionChange = (section) => (e, isExpanded) => {
    setExpandedSection(isExpanded ? section : false);
  };

  const renderLoading = () => (
    <div className="loading-container">
      <CircularProgress />
    </div>
  );

  const renderEmpty = (msg) => (
    <div className="empty-state">
      <p>{msg}</p>
    </div>
  );

  const stats = {
    currentLands: currentLands.length,
    requests: requests.length,
    favoriteOffers: favoriteOffers.length,
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
        <StatCard icon={FaInbox} title="My Requests" value={stats.requests} />
        <StatCard icon={FaHeart} title="Favorite Offers" value={stats.favoriteOffers} />
      </div>
      <div className="spacer" />

      <Accordion
        expanded={expandedSection === "current"}
        onChange={handleAccordionChange("current")}
        className="dashboard-section"
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Badge badgeContent={stats.currentLands} color="primary">
            Current Lands
          </Badge>
        </AccordionSummary>
        <AccordionDetails>
          {loading.current ? (
            renderLoading()
          ) : currentLands.length === 0 ? (
            renderEmpty("No current lands.")
          ) : (
            <div className="land-cards">
              {currentLands.map((land) => (
                <Card className="land-card" key={land.offerID} sx={{ mb: 2 }}>
                  <div className="land-image-container">
                    {land.landImage ? (
                      <img
                        src={land.landImage}
                        alt={land.landTitle}
                        className="land-image"
                      />
                    ) : (
                      <div className="no-image-placeholder">
                        <span>No Image Available</span>
                      </div>
                    )}
                    <div className="land-status active">Active</div>
                  </div>
                  <CardContent className="land-card-content">
                    <div className="land-card-header">
                      <Typography variant="h6" className="land-title">
                        {land.landTitle}
                      </Typography>
                      <div className="land-owner-info">
                        <UserAvatar
                          firstName={land.landownerFirstName}
                          lastName={land.landownerLastName}
                          imageUrl={land.landownerImage}
                          size={48}
                        />
                        <div className="owner-name">
                          {land.landownerFirstName} {land.landownerLastName}
                        </div>
                      </div>
                    </div>
                    <div className="land-details">
                      <div className="land-detail-item">
                        <div className="detail-icon">
                          <i className="fas fa-user"></i>
                        </div>
                        <div className="detail-content">
                          <span className="detail-label">Owner</span>
                          <span className="detail-value">
                            {land.landownerFirstName} {land.landownerLastName}
                          </span>
                        </div>
                      </div>
                      <div className="land-detail-item">
                        <div className="detail-icon">
                          <i className="fas fa-calendar-alt"></i>
                        </div>
                        <div className="detail-content">
                          <span className="detail-label">End Date</span>
                          <span className="detail-value">
                            {new Date(land.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="land-card-footer">
                      <Button
                        variant="contained"
                        className="view-details-btn"
                        onClick={() => navigate(`/OfferDetails/${land.offerID}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </AccordionDetails>
      </Accordion>

      <div className="spacer" />

      <Accordion
        expanded={expandedSection === "requests"}
        onChange={handleAccordionChange("requests")}
        className="dashboard-section"
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Badge badgeContent={stats.requests} color="warning">
            My Requests
          </Badge>
        </AccordionSummary>
        <AccordionDetails>
          {loading.requests ? (
            renderLoading()
          ) : requests.length === 0 ? (
            renderEmpty("No pending requests.")
          ) : (
            <div className="requests-list">
              {requests.map((r) => (
                <Card className="request-card" key={r.id} sx={{ mb: 2 }}>
                  {r.landImage && (
                    <CardMedia
                      component="img"
                      height="160"
                      image={r.landImage}
                      alt={r.landTitle}
                      sx={{ objectFit: "cover" }}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" className="request-title">{r.landTitle}</Typography>
                    <div className="request-info">
                      <div className="info-item">
                        <span className="info-label">Owner</span>
                        <span className="info-value">{r.ownerFirstName} {r.ownerLastName}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Duration</span>
                        <span className="info-value">{r.duration} months</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Status</span>
                        <span className="info-value status-badge" data-status={r.status?.toLowerCase()}>
                          {r.status || 'Pending'}
                        </span>
                      </div>
                    </div>
                    <div className="request-actions">
                      <Button
                        variant="contained"
                        className="view-offer-btn"
                        fullWidth
                        onClick={() => navigate(`/OfferDetails/${r.offerID}`)}
                      >
                        View Offer Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </AccordionDetails>
      </Accordion>

      <div className="spacer" />

      <Accordion
        expanded={expandedSection === "favorites"}
        onChange={handleAccordionChange("favorites")}
        className="dashboard-section"
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Badge badgeContent={stats.favoriteOffers} color="info">
            Favorite Offers
          </Badge>
        </AccordionSummary>
        <AccordionDetails>
          {loading.favorites
            ? renderLoading()
            : favoriteOffers.length === 0
            ? renderEmpty("No favorite offers.")
            : (
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
