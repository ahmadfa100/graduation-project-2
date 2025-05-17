import React, { useState, useEffect } from 'react';
import { monthlySeasons }   from './HomePage_data';      
import { seasonalImageMap } from './imageMap';
import '../style/Season.css';

function Season() {
  const [currentSlide, setCurrentSlide]   = useState(0);
  const [seasonalItems, setSeasonalItems] = useState([]);

  useEffect(() => {
    const monthName = new Date().toLocaleString('default', { month: 'long' });
    setSeasonalItems(monthlySeasons[monthName] || []);
  }, []);

  useEffect(() => {
    if (!seasonalItems.length) return;
    const timer = setInterval(
      () => setCurrentSlide(i => (i + 1) % seasonalItems.length),
      5000
    );
    return () => clearInterval(timer);
  }, [seasonalItems]);

  if (!seasonalItems.length) {
    return <div>No seasonal produce available.</div>;
  }

  return (
    <div className="slideshow-container">
      <button
        className="slide-arrow left-arrow"
        onClick={() =>
          setCurrentSlide(i =>
            (i - 1 + seasonalItems.length) % seasonalItems.length
          )
        }
      >
        &lt;
      </button>

      {seasonalItems.map((item, i) => (
        <div key={i} className={`slide ${i === currentSlide ? 'active' : ''}`}>
          <img
            src={
              seasonalImageMap[item] ||
              'https://via.placeholder.com/600x400?text=No+Image+Available'
            }
            alt={item}
            className="slide-image"
          />
          <div className="slide-caption">
            <h3>{item}</h3>
          </div>
        </div>
      ))}

      <button
        className="slide-arrow right-arrow"
        onClick={() => setCurrentSlide(i => (i + 1) % seasonalItems.length)}
      >
        &gt;
      </button>
    </div>
  );
}

export default Season;
