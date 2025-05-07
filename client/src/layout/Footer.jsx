// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; 

const date = new Date();
const year = date.getFullYear();

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {year} Green Bridge. All rights reserved.</p>
      <div className="footer-links">
        <Link to="/policy">Privacy Policy</Link>
        <Link to="/terms">Terms of Service</Link>
        <Link to="/contact">Contact Us</Link>
      </div>
    </footer>
  );
};

export default Footer;
