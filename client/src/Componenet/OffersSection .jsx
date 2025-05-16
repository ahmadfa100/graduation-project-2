import React, { useState, useEffect } from "react";
import { FaPhone, FaComments, FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function OffersSection({ favoriteOffers, toggleFavorite }) {
  const navigate = useNavigate();

  const [offers, setOffers] = useState([]);
  const [offset, setOffset] = useState(0);
  const limit = 3;

  const [searchTerm, setSearchTerm] = useState("");
  const [city, setCity] = useState("");
  const [period, setPeriod] = useState("");
  const [space, setSpace] = useState("");

  const [favoriteOffersList, setFavoriteOffersList] = useState([]);
  const [likedOffers, setLikedOffers] = useState([]);
const [useID,setUserID]=useState();

useEffect(()=>{
  fetchSession();
},[]);

  const handleClear = () => {
    setCity("");
    setPeriod("");
    setSpace("");
    setOffset(0);
    fetchOffers(false, 0);
  };
  async function fetchSession() {
    try {
      const sessionResponse = await axios.get(`${process.env.REACT_APP_SERVER_URL}/sessionInfo`, {
        withCredentials: true, 
      });
      const user = sessionResponse.data.user;
  
      if (user) {
      setUserID(
        sessionResponse.data.user.id
      );  
        //console.log("Session data:", user);
      } else {
        console.warn("No user found in session.");
      }
     
    } catch (err) {
     
      console.error("Failed to fetch session info:", err);
    }
  }
  async function fetchFavoriteOfferList() {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/FavoriteOffers`, {
        withCredentials: true,
      });
      setFavoriteOffersList(response.data);
    } catch (error) {
    
      console.error("Error fetching favorite offer:", error);
    }
  }

  const fetchOffers = async (append = false, newOffset = 0) => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (city) params.append("city", city);
      if (period) params.append("period", period);
      if (space) params.append("space", space);
      params.append("limit", limit);
      params.append("offset", newOffset);

      const response = await fetch(
        `http://localhost:3001/offers?${params.toString()}`
      );
      const data = await response.json();

      if (append) {
        setOffers((prev) => [...prev, ...data]);
      } else {
        setOffers(data);
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  useEffect(() => {
    fetchFavoriteOfferList();
    setOffset(0);
    fetchOffers(false, 0);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const ids = favoriteOffersList.map(fav => fav.id) // Adjust if it's `fav.id` in your DB
    setLikedOffers(ids);
  }, [favoriteOffersList]);

  const handleSearchOrFilter = () => {
    setOffset(0);
    fetchOffers(false, 0);
  };

  const handleMore = () => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    fetchOffers(true, newOffset);
  };
console.log("Outside use effect :",useID);
  return (
   
    <div className="offers-section">
      <h2 className="section-title">Available Offers</h2>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for lands..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearchOrFilter();
          }}
        />
        <button className="search-button" onClick={handleSearchOrFilter}>
          Search
        </button>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="cityFilter" className="filter-label">City</label>
          <select
            id="cityFilter"
            className="filter-select"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearchOrFilter();
              }
            }}
          >
            <option value="">All Cities</option>
            <option value="Amman">Amman</option>
            <option value="Irbid">Irbid</option>
            <option value="Zarqa">Zarqa</option>
            <option value="Aqaba">Aqaba</option>
            <option value="Madaba">Madaba</option>
            <option value="Karak">Karak</option>
            <option value="Tafilah">Tafilah</option>
            <option value="Maan">Ma'an</option>
            <option value="Ajloun">Ajloun</option>
            <option value="Jerash">Jerash</option>
            <option value="Salt">Salt</option>
            <option value="Mafraq">Mafraq</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="periodFilter" className="filter-label">Period</label>
          <select
            id="periodFilter"
            className="filter-select"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearchOrFilter();
              }
            }}
          >
            <option value="">All</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="spaceFilter" className="filter-label">Land Space</label>
          <input
            type="text"
            id="spaceFilter"
            placeholder="e.g. 5 Dunums"
            className="filter-input"
            value={space}
            onChange={(e) => setSpace(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearchOrFilter();
              }
            }}
          />
        </div>

        <button className="filter-button" onClick={handleSearchOrFilter}>
          Filter
        </button>
        <button className="clear-button" onClick={handleClear}>
          Clear
        </button>
      </div>

      {/* Offers List */}
      <div className="offers-list">
        {offers.map((offer) => (
          !offer.isreserved&&
          <div
          key={offer.id}
          className="offer-item"
          onClick={() => navigate(`/OfferDetails/${offer.id}`)}
        >
          <div className="offer-image-container">
            <img src={offer.image} alt={offer.name} className="offer-image" />
          </div>
          <div className="offer-details">
            <div className="offer-header">
              <h3 className="offer-title">{offer.landtitle}</h3>
              <span className="offer-price">{offer.landleaseprice}</span>
            </div>
            <p className="offer-subtitle">
              Land area: {offer.landsize}, location: {offer.landlocation}
            </p>
          {  useID!==offer.ownerid&&  <div className="offer-actions">
              <button
                className="action-button"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `tel:${offer.PhoneNumber}`;
                }}
              >
                <FaPhone />
              </button>
              <button
                className="action-button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/chat/${offer.id}/${offer.ownerid}`);
                }}
              >
                <FaComments />
              </button>
              <button
                className="action-button favorite-button"
                onClick={async (e) => {
                  e.stopPropagation();

                  const isLiked = likedOffers.includes(offer.id);

                  setLikedOffers((prev) =>
                    isLiked
                      ? prev.filter((id) => id !== offer.id)
                      : [...prev, offer.id]
                  );

                  try {
                    if (!isLiked) {
                      await axios.post(
                        `${process.env.REACT_APP_SERVER_URL}/AddFavoriteOffers`,
                        { offerID: offer.id },
                        { withCredentials: true }
                      );
                    } else {
                      await axios.delete(
                        `${process.env.REACT_APP_SERVER_URL}/DeleteFavoriteOffer`,
                        {
                          data: { offerID: offer.id },
                          withCredentials: true,
                        }
                      );
                    }
                  } catch (err) {
                    if (err.status === 401) {
                     
                      window.location.href = '/login';
                    }
                    console.error("Favorite toggle error:", err);
                  }

                  if (toggleFavorite) toggleFavorite(offer.id);
                }}
              >
                {likedOffers.includes(offer.id) ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>}
          </div>
        </div>
        ))}
      </div>

      {/* More Button */}
      <div className="more-button-container">
        <button className="more-button" onClick={handleMore}>
          More
        </button>
      </div>
    </div>
  );
}

export default OffersSection;

