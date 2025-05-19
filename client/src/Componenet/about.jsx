import React from "react";
import "../style/about.css";

function About() {
  return (
    <div className="about-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>About Green Bridge</h1>
          <p className="tagline">Connecting Landowners with Farmers for a green Future</p>
        </div>
      </div>

      <div className="mission-container">
        <div className="mission-text">
          <h2>Our Mission</h2>
          <p>
            At Green Bridge, we strive to provide a platform that connects agricultural landowners
            with farmers interested in cultivating and managing the land. Our goal is to enhance
            agricultural production and achieve sustainability while creating economic opportunities
            for both landowners and farmers.
          </p>
        </div>
        <div className="mission-image">
          <img src="/content images/aboutPicture.jpg" alt="Tractor on farmland" />
        </div>
      </div>

      <div className="values-section">
        <h2>Our Core Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">🌱</div>
            <h3>Sustainability</h3>
            <p>Increasing green areas to protect the environment and enhance food quality and sustainability</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🤝</div>
            <h3>Community</h3>
            <p>Building relationships between landowners and farmers</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🔒</div>
            <h3>Trust</h3>
            <p>We respect your privacy — your information is never misused or shared</p>
          </div>
        </div>
      </div>

      <div className="team-section">
        <h2>Our Team members</h2>
        <div className="team-grid">
          <div className="team-member">
            <div className="team-image">
              <img src="/ahmed.jpg" alt="Team_member" />
            </div>
            <div className="team-info">
              <h3>Ahmad Faisal bani Hamad</h3>
            </div>
          </div>
          <div className="team-member">
            <div className="team-image">
              <img src="/zr.jpg" alt="Team_member" />
            </div>
            <div className="team-info">
              <h3>Zaid Ashraf Alradaideh</h3>
            </div>
          </div>
          <div className="team-member">
            <div className="team-image">
              <img src="/user.png" alt="Team_member" />
            </div>
            <div className="team-info">
              <h3>Zaid Ghassan Hassouneh </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
