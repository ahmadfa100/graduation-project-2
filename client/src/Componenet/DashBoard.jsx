import React, { useEffect, useState } from "react";
import axios from "axios";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import {
  FaPlus,
  FaChartLine,
  FaHandshake,
  FaCalendarCheck,
  FaComments,
  FaMapMarkerAlt
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";

import "../style/DashBoard.css";
import OfferCard from "./offerCard";

export default function Dashboard() {
  const [myOffers, setMyOffers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeRentals, setActiveRentals] = useState([]);
  const [loading, setLoading] = useState({
    offers: true,
    requests: true,
    rentals: true,
  });
  const [error, setError] = useState(null);
  const [expandedSection, setExpandedSection] = useState("offers");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/dashboard/offers`, { withCredentials: true })
      .then((res) => setMyOffers(res.data))
      .catch(() => setMyOffers([]))
      .finally(() => setLoading((prev) => ({ ...prev, offers: false })));
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/dashboard/requests`, { withCredentials: true })
      .then((res) => setRequests(res.data))
      .catch(() => setRequests([]))
      .finally(() => setLoading((prev) => ({ ...prev, requests: false })));
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/dashboard/active-rentals`, { withCredentials: true })
      .then((res) => setActiveRentals(res.data))
      .catch(() => setActiveRentals([]))
      .finally(() => setLoading((prev) => ({ ...prev, rentals: false })));
  }, []);

  const handleRequestAction = async (requestId, action) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/dashboard/requests/${requestId}/${action}`,
        {},
        { withCredentials: true }
      );
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      setError(`Failed to ${action} request. Please try again.`);
      console.error(err);
    }
  };

  const handleAccordionChange = (section) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? section : false);
  };

  const renderLoading = () => (
    <div className="loading-container">
      <CircularProgress sx={{ color: "green" }} />
    </div>
  );
  const renderEmpty = (msg) => (
    <div className="empty-state">
      <p>{msg}</p>
    </div>
  );

  const stats = {
    totalOffers: myOffers.length,
    pendingRequests: requests.length,
    activeRentals: activeRentals.length,
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

  const handleDeleteOffer = async (offerId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_SERVER_URL}/deleteOffer/${offerId}`, {
        withCredentials: true,
      });
      setMyOffers((prev) => prev.filter((offer) => offer.id !== offerId));
    } catch (err) {
      setError("Failed to delete offer. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="dashboard">
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <div className="dashboard-header">
        <h1>LandOwner Dashboard</h1>
        <Tooltip title="Add New Offer">
          <button className="add-offer-button" onClick={() => navigate("/AddOffer")}>
            <FaPlus />
          </button>
        </Tooltip>
      </div>

      <div className="stats-grid">
        <StatCard icon={FaChartLine} title="My Offers" value={stats.totalOffers} />
        <StatCard icon={FaHandshake} title="Requests" value={stats.pendingRequests} />
        <StatCard icon={FaCalendarCheck} title="Active Rentals" value={stats.activeRentals} />
      </div>

      <div className="spacer" />

      <Accordion
        expanded={expandedSection === "offers"}
        onChange={handleAccordionChange("offers")}
        className="dashboard-section"
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Badge badgeContent={stats.totalOffers} color="primary">
            My Offers
          </Badge>
        </AccordionSummary>
        <AccordionDetails>
          {loading.offers ? (
            renderLoading()
          ) : myOffers.length === 0 ? (
            renderEmpty("No offers found.")
          ) : (
            <div className="offers-list">
              {myOffers.map((o) => (
                <OfferCard
                  key={o.id}
                  offer={o}
                  showEdit
                  onEdit={(id) => navigate(`/updateOffer/${id}`)}
                  onDelete={handleDeleteOffer}
                />
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
          <Badge badgeContent={stats.pendingRequests} color="warning">
            Requested Lands
          </Badge>
        </AccordionSummary>
        <AccordionDetails>
          {loading.requests ? (
            renderLoading()
          ) : requests.length === 0 ? (
            renderEmpty("No pending requests.")
          ) : (
            <div className="rentals-list">
              {requests.map((r) => (
                <div key={r.id} className="rental-card">
                  <div className="rental-images">
                    {r.landImage ? (
                      <img
                        src={r.landImage}
                        alt="Land"
                        className="rental-image land-image"
                      />
                    ) : (
                      <div className="image-placeholder">
                        <FaChartLine className="placeholder-icon" />
                        <span>Land Image</span>
                      </div>
                    )}
                    <div className="farmer-avatar-container">
                      <img
                        src={
                          r.farmerImage ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            r.farmerFirstName + ' ' + r.farmerLastName
                          )}&background=random&rounded=true&size=64`
                        }
                        alt={`${r.farmerFirstName} ${r.farmerLastName}`}
                        className="rental-image farmer-image"
                      />
                    </div>
                  </div>
                  <div className="rental-content">
                    <h4 className="rental-title">{r.landTitle}</h4>
                    <div className="rental-info">
                      <div className="rental-info-item">
                        <FaHandshake className="rental-icon" />
                        <div>
                          <span className="rental-label">Farmer</span>
                          <p>
                            {r.farmerFirstName} {r.farmerLastName} (age{" "}
                            {r.farmerAge})
                          </p>
                        </div>
                      </div>
                      <div className="rental-info-item">
                        <FaMapMarkerAlt className="rental-icon" />
                        <div>
                          <span className="rental-label">Address</span>
                          <p>{r.farmerAddress}</p>
                        </div>
                      </div>
                    </div>
                    <div className="rental-status">
                      <span className="status-badge pending">Pending</span>
                    </div>
                    <div className="request-actions">
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<FaHandshake />}
                        onClick={() => handleRequestAction(r.id, "accept")}
                        className="accept-button"
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => handleRequestAction(r.id, "reject")}
                        className="reject-button"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AccordionDetails>
      </Accordion>

      <div className="spacer" />

      <Accordion
        expanded={expandedSection === "rentals"}
        onChange={handleAccordionChange("rentals")}
        className="dashboard-section"
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Badge badgeContent={stats.activeRentals} color="info">
            Active Rentals
          </Badge>
        </AccordionSummary>

        <AccordionDetails>
          {loading.rentals ? (
            renderLoading()
          ) : activeRentals.length === 0 ? (
            renderEmpty("No active rentals.")
          ) : (
            <div className="rentals-list">
              {activeRentals.map((r) => (
                <div key={r.dealID} className="rental-card">
                  <div className="rental-images">
                    {r.landImage ? (
                      <img
                        src={r.landImage}
                        alt="Land"
                        className="rental-image land-image"
                      />
                    ) : (
                      <div className="image-placeholder">
                        <FaChartLine className="placeholder-icon" />
                        <span>Land Image</span>
                      </div>
                    )}
                  </div>

                  <div className="rental-content">
                    <h4 className="rental-title">{r.landTitle}</h4>

                    <div className="rental-info">
                      <div className="farmer-profile">
                        <img
                          src={
                            r.farmerImage ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              r.farmerFirstName + ' ' + r.farmerLastName
                            )}&background=random&rounded=true&size=64`
                          }
                          alt={`${r.farmerFirstName} ${r.farmerLastName}`}
                          className="farmer-avatar"
                        />
                        <div className="farmer-details">
                          <span className="farmer-name">
                            {r.farmerFirstName} {r.farmerLastName}
                          </span>
                          <span className="farmer-label">Current Farmer</span>
                        </div>
                      </div>

                      <div className="rental-info-item">
                        <FaCalendarCheck className="rental-icon" />
                        <div>
                          <span className="rental-label">Duration</span>
                          <p>
                            {new Date(r.startDate).toLocaleDateString()} —{" "}
                            {new Date(r.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rental-details-grid">
                      <div className="detail-item location">
                        <span className="detail-icon">📍</span>
                        <div className="detail-content">
                          <span className="detail-label">Location</span>
                          <span className="detail-value">{r.landLocation}</span>
                        </div>
                      </div>
                      <div className="detail-item price">
                        <span className="detail-icon">💰</span>
                        <div className="detail-content">
                          <span className="detail-label">Price</span>
                          <span className="detail-value">
                            {isNaN(parseFloat(r.landLeasePrice))
                              ? r.landLeasePrice
                              : parseFloat(r.landLeasePrice).toFixed(2)}{" "}
                            JOD
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="rental-status">
                      <span className="status-badge active">Active</span>
                    </div>

                    <div className="rental-actions">
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<FaComments />}
                        onClick={() => navigate(`/chat/${r.offerID}/${r.farmerID}`)}
                        className="chat-button"
                      >
                        Chat with Farmer
                      </Button>
                    </div>
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