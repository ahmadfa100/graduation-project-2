// Season.jsx
import React, { useState, useEffect } from 'react';
import { seasons } from './HomePage_data'; // Adjust path if needed
import './Season.css'; // optional if you have custom slideshow styles

function Season() {
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
  );
}

export default Season;
