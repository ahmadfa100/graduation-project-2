// OffersSection.jsx
import React from 'react';
import { FaPhone, FaComments, FaHeart, FaRegHeart } from 'react-icons/fa';

function OffersSection({ offers, favoriteOffers, toggleFavorite }) {
  return (
    <div className="offers-section">
      <h2 className="section-title">Available Offers</h2>

      <div className="offers-list">
        {offers.map((offer) => (
          <div key={offer.id} className="offer-item">
            {/* Left side: Offer Image */}
            <div className="offer-image-container">
              <img 
                src={offer.image} 
                alt={offer.name} 
                className="offer-image"
              />
            </div>

            {/* Right side: Offer Details */}
            <div className="offer-details">
              {/* Top row: Title + Price */}
              <div className="offer-header">
                <h3 className="offer-title">{offer.name}</h3>
                <span className="offer-price">{offer.price}</span>
              </div>

              {/* Subtitle */}
              <p className="offer-subtitle">
                Land area: {offer.area}, location: {offer.location}
              </p>

              {/* Buttons row */}
              <div className="offer-actions">
                <button className="action-button">
                  <FaPhone />
                </button>
                <button className="action-button">
                  <FaComments />
                </button>
                <button
                  className="action-button favorite-button"
                  onClick={() => toggleFavorite(offer.id)}
                >
                  {favoriteOffers.includes(offer.id) ? <FaHeart /> : <FaRegHeart />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="more-button-container">
        <button className="more-button">More</button>
      </div>
    </div>
  );
}

export default OffersSection;
