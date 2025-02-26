import React, { useState, useEffect } from 'react';
import './HomePage.css'; 
import Header from './Header';  // Import the shared Header
import Footer from './Footer';  // Import the shared Footer

const offers = [
  { id: 1, name: "Wheat Field", area: "5 acres", price: "$2000/year", location: "California" },
  { id: 2, name: "Vineyard", area: "10 acres", price: "$5000/year", location: "Napa Valley" },
  { id: 3, name: "Corn Field", area: "8 acres", price: "$3000/year", location: "Iowa" },
];

const seasons = [
  {
    name: "Tomato Season",
    image: "./tomatoes-growing-garden.jpg"
  },
  {
    name: "Potato Planting",
    image: "./top-view-garden-tool-with-potatoes-garlic.jpg"
  },
  {
    name: "Grape Harvest",
    image: "./vineyard-background-grape-cultivation-agricultural-landscape.jpg"
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

      <div className="offers-section">
        <h2 className="section-title">Available Offers</h2>
        <div className="offers-grid">
          {offers.map((offer) => (
            <div key={offer.id} className="offer-card">
              <div className="offer-card-header">
                <h3>{offer.name}</h3>
              </div>
              <div className="offer-card-body">
                <p><strong>Area:</strong> {offer.area}</p>
                <p><strong>Price:</strong> {offer.price}</p>
                <p><strong>Location:</strong> {offer.location}</p>
              </div>
              <button className="details-button">View Details</button>
            </div>
          ))}
        </div>
      </div>

      {/* Use the shared Footer component */}
      <Footer />  
    </div>
  );
};

export default HomePage;
