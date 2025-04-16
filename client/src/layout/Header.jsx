// Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MdNotificationsNone,
  MdNotifications,
  MdDoneOutline,
} from "react-icons/md";
import {
  Drawer,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import {
  AccountCircle,
  Chat,
  Dashboard,
  Favorite,
  ExitToApp,
} from "@mui/icons-material";
import "./Header.css";
import { FaCaretDown } from "react-icons/fa";
import { green } from "@mui/material/colors";



const Header = () => {
  const [user, setUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isIconActive, setIsIconActive] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const rightSectionRef = useRef(null);
  const navigate = useNavigate();

  // 1) On mount: check if there's an active session
  useEffect(() => {
    axios
      .get("http://localhost:3001/sessionInfo", { withCredentials: true })
      .then((res) => {
        
        if (res.data) setUser(res.data.user);
      })
      .catch(() => setUser(null));
  }, []);

  // 2) Notification icon toggle
  const handleNotificationClick = () => {
    setShowNotifications((prev) => !prev);
    setIsIconActive((prev) => !prev);
  };

  // 3) Close notifications if clicking outside
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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 4) Fetch notifications
  useEffect(() => {
    async function getNotifications() {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/notifications",
          { withCredentials: true }
        );
        setNotifications(response.data.notifications || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }
    getNotifications();
  }, []);

  // 5) Remove a notification
  const handleRemoveNotification = (index) => {
    setNotifications((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  };

  // 6) Logout handler
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3001/api/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      setOpen(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // Sidebar items
  const slidebarContent = [
    { title: "My Account", icon: <AccountCircle />, onClick: () => setOpen(false) ,link:"AccountInf" },
    { title: "Dashboard", icon: <Dashboard />, onClick: () => setOpen(false),link:"DashBoard" },
    { title: "Favorite offers", icon: <Favorite />, onClick: () => setOpen(false) ,link:"DashBoard" },
    { title: "My Chats", icon: <Chat />, onClick: () => setOpen(false) },
    { title: "Logout", icon: <ExitToApp />, onClick: handleLogout },
  ];

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
        <Link to="/DashBoard">My offers</Link>
        <Link to="/education">Education</Link>
        <Link to="/about">About</Link>
      </nav>

      {/* Right Section: notifications + sign in / drawer */}
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
          {notifications.length > 0 && (
            <span className="notification-badge">
              {notifications.length}
            </span>
          )}
        </div>

        {/* Notification Dropdown */}
        {showNotifications && (
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

        {/* Sign In / Open Drawer */}
        <div className="signup-container">
          {user ? (
            <>
              {/* Logged in: show drawer button */}
              <Button onClick={() => setOpen(true)}>
                <div className="User-Avatar-Header">
                 {user.pfp ?  <img src={URL.createObjectURL(user.pfp)} alt="pfp" /> :  <img src="./user.png" alt="pfp" />}
                <h3>Hi {user.firstname} </h3>
                <FaCaretDown  style={{ position: 'relative', top: '10px', color: 'green'}}/>

                </div>
                </Button>
              <Drawer
                anchor="right"
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                  sx: { borderRadius: 1, height: "88vh", mt: "12vh" },
                }}
              >
                <List>
                  {slidebarContent.map((item, i) => (
                    <React.Fragment key={i}>
                 <div className="Drawer-element">
                 <Link to={"/"+item.link}>
                   <ListItem button onClick={item.onClick}>
                        <ListItemIcon
                          sx={{ color: "#57b676", fontSize: "2rem" }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.title} />
                      </ListItem>
                      <Divider />
                   </Link>
                 </div>
                    </React.Fragment>
                  ))}
                </List>
              </Drawer>
            </>
          ) : (
            /* Logged out: show sign in button */
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
