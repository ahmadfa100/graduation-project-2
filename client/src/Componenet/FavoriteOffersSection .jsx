import React, { useEffect, useState } from "react";
import { FaPhone, FaComments } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FavoriteOffersSection() {
  const [favorites, setFavorites] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/FavoriteOffers`, { withCredentials: true })
      .then(res => setFavorites(res.data))
      .catch(err => {
        console.error(err);
        setFavorites([]); 
      });
  }, []);

  if (favorites === null) return <div>Loading your favorites…</div>;

  return (
    <div className="favorite-offers-section">
      <h2>My Favorite Lands</h2>
      {favorites.length === 0
        ? <div>No favorite offers found.</div>
        : (
          <div className="offers-list">
            {favorites.map(o => (
              <div
                key={o.id}
                className="offer-item"
                onClick={() => navigate(`/OfferDetails/${o.id}`)}
              >
                <img src={o.image} alt={o.landTitle} className="offer-image"/>
                <div>
                  <h3>{o.landTitle} — {o.landLeasePrice}</h3>
                  <p>Area: {o.landSize}, Location: {o.landLocation}</p>
                  <button onClick={e => { e.stopPropagation(); window.location.href = `tel:${o.phoneNumber}`; }}>
                    <FaPhone/>
                  </button>
                  <button onClick={e => e.stopPropagation()}>
                    <FaComments/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}