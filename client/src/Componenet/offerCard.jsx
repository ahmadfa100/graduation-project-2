// src/components/OfferCard.jsx
import React from "react";
import { FaPhone, FaComments, FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function OfferCard({ offer, isFavorite, onToggleFavorite }) {
  const navigate = useNavigate();

  return (
    <div
      className="offer-item"
      onClick={() => navigate(`/OfferDetails/${offer.id}`)}
    >
      <div className="offer-image-container">
        <img src={offer.image} alt={offer.landTitle} className="offer-image" />
      </div>
      <div className="offer-details">
        <div className="offer-header">
          <h3 className="offer-title">{offer.landTitle}</h3>
          <span className="offer-price">{offer.landLeasePrice}</span>
        </div>
        <p className="offer-subtitle">
          Land area: {offer.landSize}, location: {offer.landLocation}
        </p>
        <div className="offer-actions">
          <button className="action-button">
            <FaPhone />
          </button>
          <button
            className="action-button"
            onClick={e => {
              e.stopPropagation();
              navigate("/chat");
            }}
          >
            <FaComments />
          </button>
          <button
            className="action-button favorite-button"
            onClick={e => {
              e.stopPropagation();
              onToggleFavorite(offer.id);
            }}
          >
            {isFavorite ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>
      </div>
    </div>
  );
}
