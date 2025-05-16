import React, { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import '../style/UserProfile.css';

function UserProfile() {
  // Placeholder user data
  const [user, setUser] = useState({
    name: "John Farmer",
    avatar: "https://i.pravatar.cc/100?img=3",
    joinDate: "January 2020",
    bio: "Professional farmer with over 15 years of experience in sustainable agriculture. Specializing in organic produce and responsible land management in the California region."
  });

  // Placeholder stats
  const [stats, setStats] = useState({
    totalDeals: 48,
    activeOffers: 5,
    completedDeals: 43,
    successRate: 94
  });

  // Placeholder offers/rentals
  const [offers, setOffers] = useState([
    { id: 1, title: "Olive Land", status: "active", image: "./Lands/Land_1.jpg" },
    { id: 2, title: "Almond Land", status: "pending", image: "./Lands/Map.jpg" }
  ]);
  const [rentals, setRentals] = useState([
    { id: 3, title: "Watermelon Land", status: "active", image: "./Lands/Zitonjpg.jpg" },
    { id: 4, title: "Grape Land", status: "pending", image: "./Lands/Land_1.jpg" }
  ]);

  const [tab, setTab] = useState('offers');

  return (
    <div className="user-profile-page">
      <div className="profile-header">
        <img src={user.avatar} alt="avatar" className="profile-avatar" />
        <div className="profile-info">
          <h2>{user.name}</h2>
          <div className="profile-join">Member since {user.joinDate}</div>
          <div className="profile-bio">{user.bio}</div>
        </div>
      </div>
      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.totalDeals}</div>
          <div className="stat-label">Total Deals</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.activeOffers}</div>
          <div className="stat-label">Active Offers</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.completedDeals} %</div>
          <div className="stat-label">Completed Deals</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.successRate}%</div>
          <div className="stat-label">Success Rate</div>
          <div className="stat-bar"><div className="stat-bar-inner" style={{width: `${stats.successRate}%`}}></div></div>
        </div>
      </div>
      <div className="profile-tabs">
        <button className={tab === 'offers' ? 'active' : ''} onClick={() => setTab('offers')}> Offers ({offers.length})</button>
        <button className={tab === 'rentals' ? 'active' : ''} onClick={() => setTab('rentals')}>Rentals ({rentals.length})</button>
      </div>
      <div className="profile-tab-content">
        {tab === 'offers' && (
          <div className="profile-cards">
            {offers.map(o => (
              <div key={o.id} className="profile-offer-card">
                <img src={o.image} alt={o.title} className="profile-offer-img" />
                <div className="profile-offer-title">{o.title}</div>
                <div className={`profile-offer-status ${o.status}`}>{o.status}</div>
              </div>
            ))}
          </div>
        )}
        {tab === 'rentals' && (
          <div className="profile-cards">
            {rentals.map(r => (
              <div key={r.id} className="profile-offer-card">
                <img src={r.image} alt={r.title} className="profile-offer-img" />
                <div className="profile-offer-title">{r.title}</div>
                <div className={`profile-offer-status ${r.status}`}>{r.status}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile; 