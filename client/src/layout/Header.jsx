// Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  MdNotificationsNone,
  MdNotifications,
  MdCheck, 
} from "react-icons/md";
import "./Header.css";

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isIconActive, setIsIconActive] = useState(false);

  const rightSectionRef = useRef(null);

  const handleNotificationClick = () => {
    setShowNotifications((prev) => !prev);
    setIsIconActive((prev) => !prev);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        rightSectionRef.current &&
        !rightSectionRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
        setIsIconActive(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      {/* Logo & Brand */}
      <Link to="/" className="logo-container">
        <img src="./logo.jpg" alt="Logo" className="logo" />
        <span className="brand-name">Green Bridge</span>
      </Link>

      {/* Navigation Links */}
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/DashBoard">Areas</Link>
        <Link to="/education">Education</Link>
        <Link to="/about">About</Link>
      </nav>

      {/* Right section containing Notifications + Sign Up */}
      <div className="right-section" ref={rightSectionRef}>
        {/* Notification Icon */}
        <div
          className={`notification-icon ${isIconActive ? "active" : ""}`}
          onClick={handleNotificationClick}
        >
          {isIconActive ? (
            <MdNotifications size={24} />
          ) : (
            <MdNotificationsNone size={24} />
          )}
        </div>

        {/* Notification Dropdown (conditional render) */}
        {showNotifications && (
          <div className="notification-popup">
            <p>You have 2 new notifications.</p>
            <hr />
            <div className="notification-item">
              <span>Notification 1</span>
              <MdCheck className="check-icon" />
            </div>
            <div className="notification-item">
              <span>Notification 2</span>
              <MdCheck className="check-icon" />
            </div>
          </div>
        )}

        {/* Sign Up Button */}
        <div className="signup-container">
          <Link to="/signup">
            <button className="signup-button">Sign Up</button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
