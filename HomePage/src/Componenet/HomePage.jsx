import React, { useState } from "react";
import "../style/HomePage.css";
import Divider from "../layout/leaf";
import { offers } from "./HomePage_data";
import Season from "./Season";
import OffersSection from "./OffersSection ";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
      <motion.div
        className="p-6 bg-blue-500 text-white text-center rounded-lg shadow-lg"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: .7, ease: "easeOut" }}
        viewport={{ once: true }} // Animates only once when visible
      >
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
      </motion.div>

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
