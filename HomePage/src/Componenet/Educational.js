import React from 'react';
import '../style/Educational.css'; 
import '../style/equipment.css';
import '../style/AgriculturalProject.css';
import Divider from '../layout/leaf';


import  JordanFarmingEquipment from './equipment'  
import AgriculturalProject from './AgriculturalProject'
import { Link } from 'react-router-dom';

const Educational = () => {
  return (
    <div className="home-page">

      <main className="educational-content">
        {/* Top Section with three "cards" */}
        <section className="cards-section">
          <div className="card">
            <img 
              src="https://i.pinimg.com/736x/01/e5/42/01e542756f2f8a3ef5778ffe945fcdc1.jpg"
              alt="Soil Improvement" 
              className="card-image"
            />
            <h3>Soil Improvement</h3>
            <p>Learn about the best practices to enrich your soil.</p>
            <Link to="/article/1">
              <button className="green-button">Learn more</button>
            </Link>
          </div>

          <div className="card">
            <img 
              src="https://i.pinimg.com/736x/30/a6/47/30a647babaa06dde6d064458301df75a.jpg" 
              alt="Irrigation Techniques" 
              className="card-image"
            />
            <h3>Irrigation Techniques</h3>
            <p>Discover proper irrigation methods for your farm.</p>
            <Link to="/article/2">
              <button className="green-button">Learn more</button>
            </Link>
          </div>

          <div className="card">
            <img 
              src="https://i.pinimg.com/736x/3e/3f/6b/3e3f6b67c4d46ebe9d0e10f44dea1f71.jpg" 
              alt="Pest Control" 
              className="card-image"
            />
            <h3>Pest Control</h3>
            <p>Prevent crop damage using safe, sustainable methods.</p>
            <Link to="/article/3">
              <button className="green-button">Learn more</button>
            </Link>
          </div>
        </section>

        <Divider />


        {/* Starting an Agricultural Project */}

        <AgriculturalProject/>

        <Divider />


       {/* Educational Videos */}

<section className="educational-videos">
  <h2>Educational Videos</h2>
  <div className="video-grid">
    <div className="video-card">
      <div className="video-placeholder">
        <iframe
          src="https://www.youtube.com/embed/b4h_jyWjKNQ"
          title="Modern Farming Techniques"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <p>Modern Farming Techniques</p>
    </div>

    <div className="video-card">
      <div className="video-placeholder">
        <iframe
          src="https://www.youtube.com/embed/Y73frItuI2g"
          title="How to Use Farming Tools"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <p>How to Use Farming Tools</p>
    </div>

    <div className="video-card">
      <div className="video-placeholder">
        <iframe
          src="https://www.youtube.com/embed/8K9PMxBktJI"
          title="Increasing Agricultural Productivity"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <p>Increasing Agricultural Productivity</p>
    </div>
  </div>
</section>

<Divider />

<JordanFarmingEquipment />

      </main>

      
    </div>
  );
};

export default Educational;
