// about.jsx
import React from "react";
import "../style/about.css";

function About() {
  return (
    <div className="about-page">
      <div className="mission-container">
        <div className="mission-text">
          <h2>Our Mission</h2>
          <p>
            We strive to provide a platform that connects agricultural landowners
            with farmers interested in cultivating and managing the land...
          </p>
          <p>
            Our goal is to enhance agricultural production and achieve
            sustainability...
          </p>
        </div>
        <div className="mission-image">
          <img src="/content images/aboutPicture.jpg" alt="Tractor on farmland" />
        </div>
      </div>
    </div>
  );
}

export default About;
