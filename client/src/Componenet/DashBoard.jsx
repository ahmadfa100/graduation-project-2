import React, { useEffect, useState } from "react";
import axios from "axios";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import { FaPlus, FaChartLine, FaHeart, FaHandshake, FaCalendarCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";
import "../style/DashBoard.css";

import OfferCard from "./offerCard";

export default function Dashboard() {
  const [myOffers, setMyOffers] = useState([]);
  const [favoriteOffers, setFavoriteOffers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeRentals, setActiveRentals] = useState([]);
  const [loading, setLoading] = useState({ offers: true, favorites: true, requests: true, rentals: true });
  const [error, setError] = useState(null);
  const [expandedSection, setExpandedSection] = useState('offers');
  const navigate = useNavigate();

  // fetch "My Offers"
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/dashboard/offers`, { withCredentials: true })
      .then(res => setMyOffers(res.data))
      .catch(() => setMyOffers([]))
      .finally(() => setLoading(prev => ({ ...prev, offers: false })));
  }, []);

  // fetch "Favorite Offers"
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/FavoriteOffers`, { withCredentials: true })
      .then(res => setFavoriteOffers(res.data))
      .catch(() => setFavoriteOffers([]))
      .finally(() => setLoading(prev => ({ ...prev, favorites: false })));
  }, []);

  // fetch pending rental requests
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/dashboard/requests`, { withCredentials: true })
      .then(res => setRequests(res.data))
      .catch(() => setRequests([]))
      .finally(() => setLoading(prev => ({ ...prev, requests: false })));
  }, []);

  // fetch lands currently rented out
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/dashboard/active-rentals`, { withCredentials: true })
      .then(res => setActiveRentals(res.data))
      .catch(() => setActiveRentals([]))
      .finally(() => setLoading(prev => ({ ...prev, rentals: false })));
  }, []);

  const handleRemoveFavorite = async (offerId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/DeleteFavoriteOffer`,
        { data: { offerID: offerId }, withCredentials: true }
      );
      setFavoriteOffers(prev => prev.filter(o => o.id !== offerId));
    } catch (err) {
      setError("Failed to remove favorite offer. Please try again.");
      console.error(err);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/dashboard/requests/${requestId}/${action}`,
        {},
        { withCredentials: true }
      );
      setRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (err) {
      setError(`Failed to ${action} request. Please try again.`);
      console.error(err);
    }
  };

  const handleAccordionChange = (section) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? section : false);
  };

  const renderLoading = () => <div className="loading-container"><CircularProgress sx={{color:"green"}} /></div>;
  const renderEmpty = (msg) => <div className="empty-state"><p>{msg}</p></div>;

  const stats = {
    totalOffers: myOffers.length,
    totalFavorites: favoriteOffers.length,
    pendingRequests: requests.length,
    activeRentals: activeRentals.length
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
        <h1>LandOwner’ Dashboard</h1>
        <Tooltip title="Add New Offer">
          <button className="add-offer-button" onClick={() => navigate("/AddOffer")}> <FaPlus /> </button>
        </Tooltip>
      </div>

      <div className="stats-grid">
        <StatCard icon={FaChartLine} title="My Offers" value={stats.totalOffers} />
        <StatCard icon={FaHeart} title="Favorites" value={stats.totalFavorites} />
        <StatCard icon={FaHandshake} title="Requests" value={stats.pendingRequests} />
        <StatCard icon={FaCalendarCheck} title="Active Rentals" value={stats.activeRentals} />
      </div>

      <div className="spacer" />

      {/* My Offers */}
      <Accordion expanded={expandedSection === 'offers'} onChange={handleAccordionChange('offers')} className="dashboard-section">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Badge badgeContent={stats.totalOffers} color="primary">My Offers</Badge>
        </AccordionSummary>
        <AccordionDetails>
          {loading.offers ? renderLoading() : myOffers.length === 0 ? renderEmpty("No offers found.") : (
            <div className="offers-list">{myOffers.map(o => <OfferCard key={o.id} offer={o} showEdit onEdit={id => navigate(`/updateOffer/${id}`)} />)}</div>
          )}
        </AccordionDetails>
      </Accordion>

      <div className="spacer" />

      {/* Favorites */}
      <Accordion expanded={expandedSection === 'favorites'} onChange={handleAccordionChange('favorites')} className="dashboard-section">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Badge badgeContent={stats.totalFavorites} color="secondary">Favorite Offers</Badge>
        </AccordionSummary>
        <AccordionDetails>
          {loading.favorites ? renderLoading() : favoriteOffers.length === 0 ? renderEmpty("No favorites yet.") : (
            <div className="offers-list">{favoriteOffers.map(o => <OfferCard key={o.id} offer={o} isFavorite onToggleFavorite={() => handleRemoveFavorite(o.id)} />)}</div>
          )}
        </AccordionDetails>
      </Accordion>

      <div className="spacer" />

      {/* Requests */}
      <Accordion expanded={expandedSection === 'requests'} onChange={handleAccordionChange('requests')} className="dashboard-section">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Badge badgeContent={stats.pendingRequests} color="warning">Requested Lands</Badge>
        </AccordionSummary>
        <AccordionDetails>
          {loading.requests ? renderLoading() : requests.length === 0 ? renderEmpty("No pending requests.") : (
            <div className="requests-list">{requests.map(r => (
              <div key={r.id} className="request-card">
                <div className="request-content">
                  <h4 className="request-title">{r.landTitle}</h4>
                  <p className="request-farmer">Farmer: {r.farmerFirstName} {r.farmerLastName} (age {r.farmerAge})</p>
                </div>
                <div className="request-actions">
                  <Button variant="contained" fullWidth startIcon={<FaHandshake />} onClick={() => handleRequestAction(r.id, "accept")}>Accept</Button>
                  <Button variant="outlined" fullWidth className="reject-button" onClick={() => handleRequestAction(r.id, "reject")}>Reject</Button>
                </div>
              </div>
            ))}</div>
          )}
        </AccordionDetails>
      </Accordion>

      <div className="spacer" />

      {/* Active Rentals */}
      <Accordion expanded={expandedSection === 'rentals'} onChange={handleAccordionChange('rentals')} className="dashboard-section">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Badge badgeContent={stats.activeRentals} color="info">Active Rentals</Badge>
        </AccordionSummary>
        <AccordionDetails>
          {loading.rentals ? renderLoading() : activeRentals.length === 0 ? renderEmpty("No active rentals.") : (
            <div className="requests-list">{activeRentals.map(r => (
              <div key={r.dealID} className="request-card">
                <div className="request-content">
                  <h4 className="request-title">{r.landTitle}</h4>
                  <p>Farmer: {r.farmerFirstName} {r.farmerLastName}</p>
                  <p>From: {new Date(r.startDate).toLocaleDateString()} — To: {new Date(r.endDate).toLocaleDateString()}</p>
                </div>
              </div>
            ))}</div>
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}