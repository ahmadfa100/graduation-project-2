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

const SERVER = process.env.REACT_APP_SERVER_URL;

const EcommerceSlider = () => {
  const { offerID } = useParams();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const [productImages, setProductImages] = useState([]);

  useEffect(() => {
    async function loadOffer() {
      try {
        const response = await axios.get(`${SERVER}/getOffer/${offerID}`);
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
    return <div className="loading"><ClipLoader color="green" size={50} /></div>;
  }

  return (
    <>
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
            swiper.el.querySelector(".swiper-button-next").style.color = "green";
            swiper.el.querySelector(".swiper-button-prev").style.color = "green";
            swiper.el.querySelectorAll(".swiper-pagination-bullet").forEach(b => b.style.backgroundColor = "green");
          }}
        >
          {productImages.map((img, idx) => (
            <SwiperSlide key={idx}>
              <img src={img} alt={`Slide ${idx + 1}`} className="main-image" />
            </SwiperSlide>
          ))}
        </Swiper>

        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={5}
          slidesPerView={3}
          watchSlidesProgress
          modules={[Thumbs]}
          className="thumb-slider"
        >
          {productImages.map((img, idx) => (
            <SwiperSlide key={idx}>
              <img src={img} alt={`Thumb ${idx + 1}`} className="thumb-image" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {details && <Details {...details} />}
    </>
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
        const res = await axios.get(`${SERVER}/sessionInfo`, { withCredentials: true });
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
          `${SERVER}/FavoriteOffers`,
          { params: { offerID: props.id }, withCredentials: true }
        );
        // server now returns [{ id, ... }] if favorited
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
          `${SERVER}/DeleteFavoriteOffer`,
          { data: { offerID: props.id }, withCredentials: true }
        );
      } else {
        await axios.post(
          `${SERVER}/AddFavoriteOffers`,
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
        `${SERVER}/rentRequest`,
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
    <div className="details-container">
      <h1>Offer Information</h1>
      <h3>{props.landtitle}</h3>
      <h4 id="price">{props.landleaseprice} JOD</h4>
      <table>
        <tbody>
          <tr>
            <td><strong>Size</strong></td>
            <td>{props.landsize} m²</td>
          </tr>
          <tr>
            <td><strong>Rent Duration</strong></td>
            <td>{Math.floor(props.leaseduration/12)} yrs {(props.leaseduration%12)} mos</td>
          </tr>
          <tr>
            <td><strong>Address</strong></td>
            <td>{props.landlocation}</td>
          </tr>
        </tbody>
      </table>
      <LeafLine />
      <p>{props.offerdescription}</p>
      <LeafLine />

      {userID !== props.ownerid && (
        <>
          <div className="button-container">
            <Button.Call onClick={() => window.location.href = `tel:${props.PhoneNumber}`} />
            <Button.Chat onClick={() => navigate(`/chat/${props.id}/${props.ownerid}`)} />
            <Button.Like isLiked={isLiked} onClick={handleLikedOffer} />
          </div>
          <Button.Rent onClick={handleRent} />
        </>
      )}
    </div>
  );
}

export default EcommerceSlider;