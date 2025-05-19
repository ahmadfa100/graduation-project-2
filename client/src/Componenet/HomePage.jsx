import React, { useState } from "react";
import "../style/HomePage.css";
import "../style/offers-section.css";
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

  const handleScrollToOffers = () => {
    const offersSection = document.getElementById("offers-section");
    if (offersSection) {
      offersSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="home-page">


      <Season />

      {/* Action Cards */}
      <motion.div
        className="p-6 bg-blue-500 text-white text-center rounded-lg shadow-lg"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
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
              <button
                className="action-button card_home"
                onClick={handleScrollToOffers}
              >
                Learn More
              </button>
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
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <Divider />

      <div id="offers-section">
        <OffersSection
          offers={offers}
          favoriteOffers={favoriteOffers}
          toggleFavorite={toggleFavorite}
        />
      </div>
    </div>
  );
}

export default HomePage;