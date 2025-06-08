import React, { useEffect, useState } from "react";
import axios from "axios";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {
  FaPlus,
  FaChartLine,
  FaHandshake,
  FaCalendarCheck,
  FaComments,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
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

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({
    type: "",
    id: null,
    message: "",
  });

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success", 
    action: null,        
  });

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

  const openConfirm = (type, id, message) => {
    setConfirmData({ type, id, message });
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setConfirmOpen(false);
    const { type, id } = confirmData;

    try {
      switch (type) {
        case "deleteOffer":
          await axios.delete(`${process.env.REACT_APP_SERVER_URL}/deleteOffer/${id}`, {
            withCredentials: true,
          });
          setMyOffers((prev) => prev.filter((offer) => offer.id !== id));

          setToast({
            open: true,
            message: "Offer deleted successfully!",
            severity: "success",
            
          });
          break;

        case "acceptRequest":
          await axios.post(
            `${process.env.REACT_APP_SERVER_URL}/dashboard/requests/${id}/accept`,
            {},
            { withCredentials: true }
          );
          setRequests((prev) => prev.filter((r) => r.id !== id));
          setToast({
            open: true,
            message: "Request accepted!",
            severity: "success",
            action: null,
          });
          break;

        case "rejectRequest":
          await axios.post(
            `${process.env.REACT_APP_SERVER_URL}/dashboard/requests/${id}/reject`,
            {},
            { withCredentials: true }
          );
          setRequests((prev) => prev.filter((r) => r.id !== id));
          setToast({
            open: true,
            message: "Request rejected.",
            severity: "info",
            action: null,
          });
          break;

        default:
          break;
      }
    } catch (err) {
      console.error(err);
      setError(`Failed to ${type.replace(/([A-Z])/g, ' $1').toLowerCase()}. Please try again.`);
    }
  };

  const handleCancel = () => setConfirmOpen(false);

  const handleToastClose = (_, reason) => {
    if (reason === "clickaway") return;
    setToast((prev) => ({ ...prev, open: false }));
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

  return (
    <div className="dashboard">
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Dialog
        open={confirmOpen}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Action"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {confirmData.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleConfirm} autoFocus color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleToastClose}
      >
        <Alert
          onClose={handleToastClose}
          severity={toast.severity}
          action={toast.action}           
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

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
          {loading.offers
            ? renderLoading()
            : myOffers.length === 0
            ? renderEmpty("No offers found.")
            : (
              <div className="offers-list">
                {myOffers.map((o) => (
                  <OfferCard
                    key={o.id}
                    offer={o}
                    showEdit
                    onEdit={(id) => navigate(`/updateOffer/${id}`)}
                    onDelete={(id) =>
                      openConfirm(
                        "deleteOffer",
                        id,
                        "Are you sure you want to delete this offer? This action cannot be undone."
                      )
                    }
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
          {loading.requests
            ? renderLoading()
            : requests.length === 0
            ? renderEmpty("No pending requests.")
            : (
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
                          onClick={() =>
                            openConfirm(
                              "acceptRequest",
                              r.id,
                              "Are you sure you want to accept this rental request?"
                            )
                          }
                          className="accept-button"
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outlined"
                          fullWidth
                          onClick={() =>
                            openConfirm(
                              "rejectRequest",
                              r.id,
                              "Are you sure you want to reject this request?"
                            )
                          }
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
          {loading.rentals
            ? renderLoading()
            : activeRentals.length === 0
            ? renderEmpty("No active rentals.")
            : (
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
