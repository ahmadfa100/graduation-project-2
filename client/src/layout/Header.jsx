// src/components/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MdNotificationsNone,
  MdNotifications,
  MdDoneOutline,
} from "react-icons/md";
import { Drawer, Button, Divider, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { AccountCircle, Chat, Dashboard, Favorite, ExitToApp } from "@mui/icons-material";
import { FaCaretDown } from "react-icons/fa";
import "./Header.css";

const Header = () => {
  const [user, setUser]                     = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isIconActive, setIsIconActive]     = useState(false);
  const [notifications, setNotifications]   = useState([]);
  const [open, setOpen]                     = useState(false);
  const rightSectionRef                     = useRef(null);
  const navigate                            = useNavigate();

  // 1) session check
  useEffect(() => {
    axios.get("http://localhost:3001/sessionInfo", { withCredentials: true })
      .then(res => {
        if (res.data && res.data.user) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, []);

  // 2) fetch notifications only after we know the user is logged in
  useEffect(() => {
    if (!user) return;   // <-- skip if not logged in
    axios.get("http://localhost:3001/api/notifications", { withCredentials: true })
      .then(res => setNotifications(res.data.notifications || []))
      .catch(err => console.error("Error fetching notifications:", err));
  }, [user]);

  // 3) toggle popup
  const handleNotificationClick = () => {
    setShowNotifications(prev => !prev);
    setIsIconActive(prev => !prev);
  };

  // 4) close if outside click
  useEffect(() => {
    const handleClickOutside = e => {
      if (rightSectionRef.current && !rightSectionRef.current.contains(e.target)) {
        setShowNotifications(false);
        setIsIconActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 5) remove + auto‑close
  const handleRemoveNotification = index => {
    setNotifications(prev => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) {
        setShowNotifications(false);
        setIsIconActive(false);
      }
      return next;
    });
  };

  // 6) logout
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3001/api/logout", {}, { withCredentials: true });
      setUser(null);
      setOpen(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const slidebarContent = [
    { title: "My Account",      icon: <AccountCircle />, onClick: () => setOpen(false), link: "AccountInf" },
    { title: "Dashboard",       icon: <Dashboard />,      onClick: () => setOpen(false), link: "DashBoard" },
    { title: "Favorite offers", icon: <Favorite />,       onClick: () => setOpen(false), link: "DashBoard" },
    { title: "My Chats",        icon: <Chat />,           onClick: () => setOpen(false) },
    { title: "Logout",          icon: <ExitToApp />,      onClick: handleLogout },
  ];

  return (
    <header className="header">
      <Link to="/" className="logo-container">
        <img src="./logo.jpg" alt="Logo" className="logo"/>
        <span className="brand-name">Green Bridge</span>
      </Link>

      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/DashBoard">My offers</Link>
        <Link to="/education">Education</Link>
        <Link to="/about">About</Link>
      </nav>

      <div className="right-section" ref={rightSectionRef}>
        { /* — only show the bell when there’s a user — */ }
        {user && (
          <>
            <div
              className={`notification-icon ${isIconActive ? "active" : ""}`}
              onClick={handleNotificationClick}
            >
              {isIconActive
                ? <MdNotifications size={24}/>
                : <MdNotificationsNone size={24}/>
              }
              {notifications.length > 0 && (
                <span className="notification-badge">
                  {notifications.length}
                </span>
              )}
            </div>

            {showNotifications && notifications.length > 0 && (
              <div className="notification-popup">
                <p>You have {notifications.length} new notifications.</p>
                <hr />
                {notifications.map((notif, idx) => (
                  <div key={idx} className="notification-item">
                    <span>{notif.message}</span>
                    <MdDoneOutline
                      size={24}
                      className="check-icon"
                      onClick={() => handleRemoveNotification(idx)}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <div className="signup-container">
          {user ? (
            <>
              <Button onClick={() => setOpen(true)}>
                <div className="User-Avatar-Header">
                  {user.pfp
                    ? <img src={URL.createObjectURL(user.pfp)} alt="pfp" />
                    : <img src="./user.png" alt="pfp" />}
                  <h3>Hi {user.firstname}</h3>
                  <FaCaretDown style={{ position: 'relative', top: '10px', color: 'green' }}/>
                </div>
              </Button>
              <Drawer
                anchor="right"
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{ sx: { borderRadius: 1, height: "88vh", mt: "12vh" } }}
              >
                <List>
                  {slidebarContent.map((item, i) => (
                    <React.Fragment key={i}>
                      <Link to={"/" + (item.link || "")}>
                        <ListItem button onClick={item.onClick}>
                          <ListItemIcon sx={{ color: "#57b676", fontSize: "2rem" }}>
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText primary={item.title}/>
                        </ListItem>
                        <Divider/>
                      </Link>
                    </React.Fragment>
                  ))}
                </List>
              </Drawer>
            </>
          ) : (
            <Link to="/login">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
