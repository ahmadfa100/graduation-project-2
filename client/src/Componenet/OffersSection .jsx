// OffersSection.jsx

import React from 'react';
import { FaPhone, FaComments, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function OffersSection({ offers, favoriteOffers, toggleFavorite }) {
  const navigate = useNavigate();

  return (
    <div className="offers-section">
      <h2 className="section-title">Available Offers</h2>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for lands..."
          className="search-input"
        />
        <button className="search-button">Search</button>
      </div>

      {/* === Filters Container === */}
      <div className="filters-container">
        {/* City Filter */}
        <div className="filter-group">
          <label htmlFor="cityFilter" className="filter-label">City</label>
          <select id="cityFilter" className="filter-select">
            <option value="">All Cities</option>
            <option value="Amman">Amman</option>
            <option value="Irbid">Irbid</option>
            <option value="Zarqa">Zarqa</option>
            <option value="Aqaba">Aqaba</option>
            <option value="Madaba">Madaba</option>
            <option value="Karak">Karak</option>
            <option value="Tafilah">Tafilah</option>
            <option value="Maan">Ma'an</option>
            <option value="Ajloun">Ajloun</option>
            <option value="Jerash">Jerash</option>
            <option value="Salt">Salt</option>
            <option value="Mafraq">Mafraq</option>
          </select>
        </div>

        {/* Period of Rent Filter */}
        <div className="filter-group">
          <label htmlFor="periodFilter" className="filter-label">Period</label>
          <select id="periodFilter" className="filter-select">
            <option value="">All</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {/* Land Space Filter */}
        <div className="filter-group">
          <label htmlFor="spaceFilter" className="filter-label">Land Space</label>
          <input
            type="text"
            id="spaceFilter"
            placeholder="e.g. 5 Dunums"
            className="filter-input"
          />
        </div>

        <button className="filter-button">Filter</button>
      </div>
      {/* End of Filters Container */}

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

            <div className="offer-details">
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
                <button
                  className="action-button"
                  onClick={() => navigate("/chat")}
                >
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
