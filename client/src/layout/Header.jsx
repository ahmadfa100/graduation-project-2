import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  MdNotificationsNone,
  MdNotifications,
  MdDoneOutline,
} from "react-icons/md";
import "./Header.css";

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isIconActive, setIsIconActive] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const rightSectionRef = useRef(null);

  const handleNotificationClick = () => {
    setShowNotifications((prev) => !prev);
    setIsIconActive((prev) => !prev);
  };

  // Close the dropdown if user clicks outside
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

  // Fetch notifications from the backend
  useEffect(() => {
    async function getNotifications() {
      try {
        const response = await axios.get("http://localhost:3001/api/notifications");
        setNotifications(response.data.notifications || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }
    getNotifications();
  }, []);

  // Remove a notification from the list
  const handleRemoveNotification = (index) => {
    setNotifications((prevNotifications) => {
      const newNotifications = [...prevNotifications];
      newNotifications.splice(index, 1);
      return newNotifications;
    });
  };

  return (
    <header className="header">
      <Link to="/" className="logo-container">
        <img src="./logo.jpg" alt="Logo" className="logo" />
        <span className="brand-name">Green Bridge</span>
      </Link>

      {/* Navigation Links */}
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/DashBoard">My offers</Link>
        <Link to="/education">Education</Link>
        <Link to="/about">About</Link>
      </nav>

      <div className="right-section" ref={rightSectionRef}>
        {/* Notification Icon + Badge */}
        <div
          className={`notification-icon ${isIconActive ? "active" : ""}`}
          onClick={handleNotificationClick}
        >
          {isIconActive ? (
            <MdNotifications size={24} />
          ) : (
            <MdNotificationsNone size={24} />
          )}
          {notifications.length > 0 && (
            <span className="notification-badge">
              {notifications.length}
            </span>
          )}
        </div>

        {/* Notification Dropdown (conditional render) */}
        {showNotifications && (
          <div className="notification-popup">
            <p>You have {notifications.length} new notifications.</p>
            <hr />
            {notifications.map((notif, index) => (
              <div key={index} className="notification-item">
                <span>{notif.message}</span>
                <MdDoneOutline
                  size={24}
                  className="check-icon"
                  onClick={() => handleRemoveNotification(index)}
                />
              </div>
            ))}
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
