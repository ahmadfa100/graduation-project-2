import React, { useState, useEffect } from "react";
import "../style/offerdetail.css";
import LeafLine from "../layout/leafLine";
import * as Button from "../layout/buttons";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import { useNotifications } from '@toolpad/core/useNotifications';

const EcommerceSlider = () => {
  const { offerID } = useParams();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const [productImages, setProductImages] = useState([]);

  useEffect(() => {
    async function loadOffer() {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/getOffer/${offerID}`);
        if (response.data && response.data.images) {
          setDetails(response.data.offer);
          setProductImages(response.data.images);
        } else {
          console.error("No images found in response:", response.data);
        }
      } catch (error) {
        console.error("Error fetching offer details:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadOffer();
  }, [offerID]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <ClipLoader color="#4CAF50" size={50} />
      </div>
    );
  }

  return (
    <div className="offer-detail-page">
      <div className="offer-content-container">
        <div className="image-slider-section">
          <div className="slider-container">
            <Swiper
              centeredSlides
              spaceBetween={5}
              slidesPerView="auto"
              loop
              keyboard={{ enabled: true }}
              navigation
              pagination={{ clickable: true }}
              modules={[Navigation, Pagination, Thumbs, Keyboard]}
              thumbs={{ swiper: thumbsSwiper }}
              className="main-slider"
              onInit={swiper => {
                swiper.el.querySelector(".swiper-button-next").style.color = "#4CAF50";
                swiper.el.querySelector(".swiper-button-prev").style.color = "#4CAF50";
                swiper.el.querySelectorAll(".swiper-pagination-bullet").forEach(b => b.style.backgroundColor = "#4CAF50");
              }}
            >
              {productImages.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <div className="image-wrapper">
                    <img src={img} alt={`Slide ${idx + 1}`} className="main-image" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={4}
              watchSlidesProgress
              modules={[Thumbs]}
              className="thumb-slider"
            >
              {productImages.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <div className="thumb-wrapper">
                    <img src={img} alt={`Thumb ${idx + 1}`} className="thumb-image" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {details && <Details {...details} />}
      </div>
    </div>
  );
};

function Details(props) {
  const [userID, setUserID] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();
  const notifications = useNotifications();

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/sessionInfo`, { withCredentials: true });
        setUserID(res.data.user?.id);
      } catch (err) {
        console.error("Failed to fetch session:", err);
      }
    }
    fetchSession();
  }, []);

  useEffect(() => {
    async function checkFavorite() {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/FavoriteOffers`,
          { params: { offerID: props.id }, withCredentials: true }
        );
        setIsLiked(Array.isArray(res.data) && res.data.some(fav => fav.offerid === props.id));
      } catch (err) {
        console.error("Error fetching favorite status:", err);
      }
    }
    checkFavorite();
  }, [props.id]);

  const handleLikedOffer = async () => {
    try {
      if (isLiked) {
        await axios.delete(
          `${process.env.REACT_APP_SERVER_URL}/DeleteFavoriteOffer`,
          { data: { offerID: props.id }, withCredentials: true }
        );
      } else {
        await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/AddFavoriteOffers`,
          { offerID: props.id },
          { withCredentials: true }
        );
      }
      setIsLiked(!isLiked);
    } catch (err) {
      if (err.response?.status === 401) {
        window.location.href = '/login';
        return;
      }
      console.error(err);
    }
  };

  const handleRent = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/rentRequest`,
        { offerID: props.id, landOwner: props.ownerid },
        { withCredentials: true }
      );
      notifications.show('Offer request reserved successfully', { severity: 'success', autoHideDuration: 3000 });
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        window.location.href = '/login';
      } else if (error.response?.status === 409) {
        notifications.show('You have already sent the request.', { severity: 'error', autoHideDuration: 3000 });
      } else {
        notifications.show('Something went wrong', { severity: 'error', autoHideDuration: 3000 });
      }
    }
  };

  return (
    <div className="details-section">
      <div className="details-header">
        <h1 className="offer-title">{props.landtitle}</h1>
        <div className="price-tag">
          <span>{props.landleaseprice} JOD</span>
        </div>
      </div>

      <div className="details-card">
        <div className="specs-grid">
          <div className="spec-item">
            <div className="spec-icon size-icon"></div>
            <div>
              <h4>Size</h4>
              <p>{props.landsize} m²</p>
            </div>
          </div>
          
          <div className="spec-item">
            <div className="spec-icon duration-icon"></div>
            <div>
              <h4>Rent Duration</h4>
              <p>{Math.floor(props.leaseduration/12)} yrs {(props.leaseduration%12)} mos</p>
            </div>
          </div>
          
          <div className="spec-item">
            <div className="spec-icon location-icon"></div>
            <div>
              <h4>Address</h4>
              <p>{props.landlocation}</p>
            </div>
          </div>
        </div>

        <div className="description-section">
          <h3>Description</h3>
          
          <p className="description-text">{props.offerdescription}</p>
        </div>
        <LeafLine />
        {userID !== props.ownerid && (
          <div className="action-section">
            <div className="quick-actions">
              <Button.Call 
                onClick={() => window.location.href = `tel:${props.PhoneNumber}`} 
                className="action-btn"
              />
              <Button.Chat 
                onClick={() => navigate(`/chat/${props.id}/${props.ownerid}`)} 
                className="action-btn"
              />
              <Button.Like 
                isLiked={isLiked} 
                onClick={handleLikedOffer} 
                className="action-btn"
              />
            </div>
            <Button.Rent 
              onClick={handleRent} 
              className="rent-btn"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default EcommerceSlider;