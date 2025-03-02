import React from 'react';
import './Header.css'; 

const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <img 
          src="./logo.jpg" 
          alt="Logo" 
          className="logo" 
        />
        <span className="brand-name">Green Bridge</span>
      </div>

      <nav className="nav-links">
        <a href="./HomePage.js">Home</a>
        <a href="./areas">Areas</a>
        <a href="/education">Education</a>
        <a href="/about">About</a>
      </nav>

      {/* Sign Up Button (Replaces Login Icon) */}
      <div className="signup-container">
        <button className="signup-button">Sign Up</button>
      </div>
    </header>
  );
};

export default Header;
