// Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <Link to="/" className="logo-container">
        <img src="./logo.jpg" alt="Logo" className="logo" />
        <span className="brand-name">Green Bridge</span>
      </Link>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/areas">Areas</Link>
        <Link to="/education">Education</Link>
        <Link to="/about">About</Link>
      </nav>

      <div className="signup-container">
        {/* Wrap the button with Link */}
        <Link to="/signup">
          <button className="signup-button">Sign Up</button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
