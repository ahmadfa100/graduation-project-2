import React, { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import '../style/UserProfile.css';

function UserProfile() {
  // Dynamic user data
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [offers, setOffers] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('offers');

  useEffect(() => {
    async function fetchProfileData() {
      setLoading(true);
      try {
        // Fetch user info
        const userRes = await axios.get('/api/profile', { withCredentials: true });
        setUser(userRes.data);
        // Fetch stats
        const statsRes = await axios.get('/api/profile/stats', { withCredentials: true });
        setStats(statsRes.data);
        // Fetch offers
        const offersRes = await axios.get('/dashboard/offers', { withCredentials: true });
        setOffers(offersRes.data);
        // Fetch rentals (if endpoint exists)
        try {
          const rentalsRes = await axios.get('/dashboard/rentals', { withCredentials: true });
          setRentals(rentalsRes.data);
        } catch (err) {
          setRentals([]); // fallback if endpoint doesn't exist
        }
      } catch (err) {
        // Handle error (could show a message)
        setUser(null);
        setStats(null);
        setOffers([]);
        setRentals([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProfileData();
  }, []);

  if (loading) return <div className="user-profile-page">Loading profile…</div>;
  if (!user) return <div className="user-profile-page">Failed to load profile.</div>;

  return (
    <div className="user-profile-page">
      <div className="profile-header">
        <img src={user.avatar || "https://i.pravatar.cc/100?img=3"} alt="avatar" className="profile-avatar" />
        <div className="profile-info">
          <h2>{user.name}</h2>
          <div className="profile-join">Member since {user.joinDate}</div>
          <div className="profile-bio">{user.bio}</div>
        </div>
      </div>
      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-value">{stats ? stats.totalDeals : '-'}</div>
          <div className="stat-label">Total Deals</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats ? stats.activeOffers : '-'}</div>
          <div className="stat-label">Active Offers</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats ? stats.completedDeals : '-'} %</div>
          <div className="stat-label">Completed Deals</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats ? stats.successRate : '-'}%</div>
          <div className="stat-label">Success Rate</div>
          <div className="stat-bar"><div className="stat-bar-inner" style={{width: stats ? `${stats.successRate}%` : '0%'}}></div></div>
        </div>
      </div>
      <div className="profile-tabs">
        <button className={tab === 'offers' ? 'active' : ''} onClick={() => setTab('offers')}>Offers ({offers.length})</button>
        <button className={tab === 'rentals' ? 'active' : ''} onClick={() => setTab('rentals')}>Rentals ({rentals.length})</button>
      </div>
      <div className="profile-tab-content">
        {tab === 'offers' && (
          <div className="profile-cards">
            {offers.length === 0 ? <div>No offers found.</div> : offers.map(o => (
              <div key={o.id} className="profile-offer-card">
                <img src={o.image} alt={o.title || o.landTitle} className="profile-offer-img" />
                <div className="profile-offer-title">{o.title || o.landTitle}</div>
                <div className={`profile-offer-status ${o.status || ''}`}>{o.status || ''}</div>
              </div>
            ))}
          </div>
        )}
        {tab === 'rentals' && (
          <div className="profile-cards">
            {rentals.length === 0 ? <div>No rentals found.</div> : rentals.map(r => (
              <div key={r.id} className="profile-offer-card">
                <img src={r.image} alt={r.title || r.landTitle} className="profile-offer-img" />
                <div className="profile-offer-title">{r.title || r.landTitle}</div>
                <div className={`profile-offer-status ${r.status || ''}`}>{r.status || ''}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile; 