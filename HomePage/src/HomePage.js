import React, { useState, useEffect } from 'react';
import './HomePage.css'; 

import './layout/Header.css';  
import './layout/Footer.css';  

import Header from './layout/Header';  
import Footer from './layout/Footer';  

import {
  FaPhone,
  FaComments,
  FaHeart,
  FaRegHeart
} from 'react-icons/fa';

const offers = [
  {
    id: 1,
    name: "Wheat Field",
    area: "5 acres",
    price: "$2000/year",
    location: "California",
    image: "./Lands/Land_1.jpg" // Replace with real image
  },
  {
    id: 2,
    name: "Vineyard",
    area: "10 acres",
    price: "$5000/year",
    location: "Napa Valley",
    image: "./Lands/Map.jpg"
  },
  {
    id: 3,
    name: "Corn Field",
    area: "8 acres",
    price: "$3000/year",
    location: "Iowa",
    image: "./Lands/Zitonjpg.jpg"
  },
];


const seasons = [
  {
    name: "Tomato Season",
    image: "./content images/tomatoes-growing-garden.jpg"
  },
  {
    name: "Potato Planting",
    image: "./content images/top-view-garden-tool-with-potatoes-garlic.jpg"
  },
  {
    name: "Grape Harvest",
    image: "./content images/vineyard-background-grape-cultivation-agricultural-landscape.jpg"
  },
];

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % seasons.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + seasons.length) % seasons.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % seasons.length);
  };

  const [favoriteOffers, setFavoriteOffers] = useState([]);

  // Toggle the favorite state for an offer by its ID
  const toggleFavorite = (offerId) => {
    setFavoriteOffers((prevFavorites) =>
      prevFavorites.includes(offerId)
        ? prevFavorites.filter((id) => id !== offerId)
        : [...prevFavorites, offerId]
    );
  };
  return (
    <div className="home-page">
      {/* Use the shared Header component */}
      <Header />  

      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search for lands..." 
          className="search-input"
        />
        <button className="search-button">Search</button>
      </div>

      <div className="slideshow-container">
        <button className="slide-arrow left-arrow" onClick={handlePrevSlide}>
          &lt;
        </button>

        {seasons.map((season, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
          >
            <img 
              src={season.image} 
              alt={season.name}
              className="slide-image"
            />
            <div className="slide-caption">
              <h3>{season.name}</h3>
            </div>
          </div>
        ))}

        <button className="slide-arrow right-arrow" onClick={handleNextSlide}>
          &gt;
        </button>
      </div>

      <div className="action-container">
        <div className="action-card">
          <img 
            src="https://i.pinimg.com/736x/b9/7b/62/b97b62328e8f52113257b9ca1bd698e5.jpg" 
            alt="Rent Land" 
            className="action-image"
          />
          <div className="action-content">
            <h2>Rent Land</h2>
            <button className="action-button">Learn More</button>
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
            <button className="action-button">Offer Land</button>
          </div>
        </div>
      </div>
          
      <div class="divider">
        <div class="divider-line"></div>
        <div class="divider-icon">
          <img src="https://www.farmers.gov/themes/farmers_update/assets/img/leaves.svg" alt="ورقة"/>
        </div>
        <div class="divider-line"></div>
      </div>



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

                {/* Subtitle (area, lease period, etc.) */}
                <p className="offer-subtitle">
                  Land area: {offer.area}, location: {offer.location}
                </p>

                {/* Buttons row */}
                <div className="offer-actions">
                  {/* Phone button */}
                  <button className="action-button">
                    <FaPhone />
                  </button>

                  {/* Chat button */}
                  <button className="action-button">
                    <FaComments />
                  </button>

                  {/* Favorite (heart) button */}
                  <button
                    className="action-button favorite-button"
                    onClick={() => toggleFavorite(offer.id)}
                  >
                    {
                      favoriteOffers.includes(offer.id)
                        ? <FaHeart />       // Filled heart
                        : <FaRegHeart />    // Outline heart
                    }
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



      {/* Use the shared Footer component */}
      <Footer />  
    </div>
  );
};

export default HomePage;
