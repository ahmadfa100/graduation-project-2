import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";  
import axios from "axios";
import "../style/offerdetail.css";
import LeafLine from "../layout/leafLine";
import * as Button from "../layout/buttons";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, Keyboard } from "swiper/modules";

function OfferDetails() {
  const { offerID } = useParams();  
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState({});
  const [productImages, setProductImages] = useState([]);

  useEffect(() => {
    fetchOffer();
  }, []);

  async function fetchOffer() {
    try {
      // Use the offerID from the route
      const response = await axios.get(`http://localhost:3001/getOffer/${offerID}`);
      if (response.data && response.data.images) {
        setDetails(response.data.offer);
        setProductImages(response.data.images);
      } else {
        console.error("No images found in response:", response.data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching offer details:", error);
    }
  }

  // The rest of your rendering logic...
  return (
    <>
      {isLoading ? (
        <div className="loading">
          <ClipLoader color="green" size={50} />
        </div>
      ) : (
        <>
          <div className="slider-container">
            {/* Main Slider */}
            <Swiper
              centeredSlides
              spaceBetween={5}
              slidesPerView={"auto"}
              loop
              keyboard={{ enabled: true }}
              navigation
              pagination={{ clickable: true }}
              modules={[Navigation, Pagination, Thumbs, Keyboard]}
              thumbs={{ swiper: thumbsSwiper }}
              className="main-slider"
            >
              {productImages.map((img, index) => (
                <SwiperSlide key={index}>
                  <img src={img} alt={`Product ${index + 1}`} className="main-image" />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Thumbnail Slider */}
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={5}
              slidesPerView={3}
              watchSlidesProgress
              modules={[Thumbs]}
              className="thumb-slider"
            >
              {productImages.map((img, index) => (
                <SwiperSlide key={index}>
                  <img src={img} alt={`Thumbnail ${index + 1}`} className="thumb-image" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Render your details */}
          <Details details={details} />
        </>
      )}
    </>
  );
}

function Details({ details }) {

  const {
    landtitle,
    landleaseprice,
    landsize,
    leaseduration,
    landlocation,
    offerdescription,
  } = details;

  return (
    <div className="details-container">
      <h1>Offer Information</h1>
      <div>
        <h3>{landtitle}</h3>
      </div>
      <h4 id="price">{landleaseprice} JOD</h4>
      <table>
        <tbody>
          <tr>
            <td><strong>Size</strong></td>
            <td>{landsize} m²</td>
          </tr>
          <tr>
            <td><strong>Rent Duration</strong></td>
            <td>
              {Math.floor(leaseduration / 12) === 1
                ? "one year"
                : `${Math.floor(leaseduration / 12)} years`}{" "}
              and{" "}
              {leaseduration % 12 === 1
                ? "one month"
                : `${leaseduration % 12} months`}
            </td>
          </tr>
          <tr>
            <td><strong>Address</strong></td>
            <td>{landlocation}</td>
          </tr>
        </tbody>
      </table>
      <div className="custom-element">
        <LeafLine />
      </div>
      <p>{offerdescription}</p>
      <div className="custom-element">
        <LeafLine />
      </div>
      <div className="button-container">
        <Button.Call />
        <Link to="/chat">
          <Button.Chat />
        </Link>
        <Button.Like />
      </div>
    </div>
  );
}

export default OfferDetails;
