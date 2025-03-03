import React, { useState } from "react";
import "../style/HomePage.css";

import "../layout/Header.css";
import "../layout/Footer.css";
import Header from "../layout/Header";
import Divider from "../layout/leaf";
import Footer from "../layout/Footer";

import { offers } from "./HomePage_data";

import Season from "./Season";
import OffersSection from "./OffersSection ";

import { FaPhone, FaComments, FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const [favoriteOffers, setFavoriteOffers] = useState([]);

  const toggleFavorite = (offerId) => {
    setFavoriteOffers((prevFavorites) =>
      prevFavorites.includes(offerId)
        ? prevFavorites.filter((id) => id !== offerId)
        : [...prevFavorites, offerId]
    );
  };

  return (
    <div className="home-page">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for lands..."
          className="search-input"
        />
        <button className="search-button">Search</button>
      </div>

      <Season />

      {/* Action Cards */}
      <div className="action-container">
        <div className="action-card">
          <img
            src="https://i.pinimg.com/736x/b9/7b/62/b97b62328e8f52113257b9ca1bd698e5.jpg"
            alt="Rent Land"
            className="action-image"
          />
          <div className="action-content">
            <h2>Rent Land</h2>
            <button className="action-button card_home">Learn More</button>
          </div>
        </div>

        <div className="action-card">
          <img
            src="https://i.pinimg.com/736x/97/e9/aa/97e9aab718aee4e3b912bbcf86b41ef1.jpg"
            alt="Offer Land"
            className="action-image"
          />
          <div className="action-content">
            <h2>Offer Land</h2>
            <button
              className="action-button card_home"
              onClick={() => navigate("/addOffer")}
            >
              Offer Land
            </button>{" "}
          </div>
        </div>
      </div>

      <Divider />

      {/* OffersSection */}
      <OffersSection
        offers={offers}
        favoriteOffers={favoriteOffers}
        toggleFavorite={toggleFavorite}
      />
    </div>
  );
}

export default HomePage;
