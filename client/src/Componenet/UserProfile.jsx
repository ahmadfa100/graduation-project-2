import React, { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import '../style/UserProfile.css';
import { useNavigate, useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [offers, setOffers] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('offers');
  const { userID } = useParams();
const navigate= useNavigate();

  useEffect(() => {
    async function fetchProfileData() {
      setLoading(true);
      try {
        // Fetch user info
        const userRes = await axios.get(`${process.env.REACT_APP_SERVER_URL}/getProfile/${userID}`, { withCredentials: true });
        console.log("User data:", userRes.data);
        setUser(userRes.data);
        
        // Fetch stats
        const statsRes = await axios.get(`${process.env.REACT_APP_SERVER_URL}/profileStats/${userID}`, { withCredentials: true });
        console.log("Stats data:", statsRes.data);
        setStats(statsRes.data);
        
        // Fetch offers
        const offersRes = await axios.get(`${process.env.REACT_APP_SERVER_URL}/getUserOffers/${userID}`, { withCredentials: true });
        console.log("Offers data:", offersRes.data);
        setOffers(offersRes.data);
        
        // Fetch rentals (if endpoint exists)
        try {
          const rentalsRes = await axios.get(`${process.env.REACT_APP_SERVER_URL}/rentedOffers/${userID}`, { withCredentials: true });
          console.log("Rentals data:", rentalsRes.data);
          setRentals(rentalsRes.data);
        } catch (err) {
          if (err.response && err.response.status === 401) {
            console.log("Not authenticated! Redirecting to login...");
            window.location.href = "/login";
            return;
          }
          console.log("No rentals endpoint or error fetching rentals:", err);
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          console.log("Not authenticated! Redirecting to login...");
          window.location.href = "/login";
          return;
        }
        // Handle error 
        setUser(null);
        setStats(null);
        setOffers([]);
        setRentals([]);
        console.log("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfileData();
  }, [userID]);

  if (loading) return <div className="clip-loader">  <ClipLoader color="green" size={50} /></div>;
  if (!user) return <div className="user-profile-page">Failed to load profile.</div>;

  return (
    <div className="user-profile-page">
      <div className="profile-header">
        <img src={user.avatar || "/user.png"} alt="avatar" className="profile-avatar" />
        <div className="profile-info">
          <h2>{user.name}</h2>
          <div className="profile-join">Member since {user.joinDate}</div>
         
        </div>
      </div>
      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-value">{stats ? stats.total_deals : '-'}</div>
          <div className="stat-label">Total Deals</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats ? stats.active_offers : '-'}</div>
          <div className="stat-label">Active Offers</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats ? stats.success_rate : '-'}%</div>
          <div className="stat-label">Success Rate</div>
          <div className="stat-bar"><div className="stat-bar-inner" style={{width: stats ? `${stats.success_rate}%` : '0%'}}></div></div>
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
              <div key={o.id} className="profile-offer-card" onClick={()=>{ navigate(`/OfferDetails/${o.id}`)}}>
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
              <div key={r.id} className="profile-offer-card"onClick={()=>{ navigate(`/OfferDetails/${r.offerID}`)}} >
                <img src={r.landPicture} alt={r.title || r.landTitle} className="profile-offer-img" />
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