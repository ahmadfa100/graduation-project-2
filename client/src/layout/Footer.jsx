import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; 

const date = new Date();
const year = date.getFullYear();

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Green Bridge</h3>
          <p>Building sustainable connections for a greener future.</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <div className="footer-links">
            <Link to="/policy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© {year} Green Bridge. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
