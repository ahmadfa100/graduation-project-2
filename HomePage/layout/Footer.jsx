// src/components/Footer.jsx
import React from 'react';
import './Footer.css'; 

const date = new Date();
const year = date.getFullYear();

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {year} Green Bridge. All rights reserved.</p>
      <div className="footer-links">
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
        <a href="/contact">Contact Us</a>
      </div>
    </footer>
  );
};

export default Footer;
