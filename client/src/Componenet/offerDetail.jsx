import { useState,useEffect } from "react";
import "../style/offerdetail.css";
import LeafLine from "../layout/leafLine";
import * as Button from "../layout/buttons";
import { useNavigate ,useParams} from "react-router-dom";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, Keyboard,} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "../style/offerdetail.css";

const EcommerceSlider = () => {
  const { offerID } = useParams();  
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState([]);
  const [productImages, setProductImages] = useState([]);

  
  useEffect(() => {
    fetchoffer();
   }, []);
   async function fetchoffer() {
     
     try {
       const response = await axios.get(`http://localhost:3001/getOffer/${offerID}`);
       
       //console.log("Full server response:", response.data);
       //console.log("here",response.data.images);
       if (response.data && response.data.images) {
         setDetails(response.data.offer);
         setProductImages(response.data.images);
         
         setIsLoading(false);
 
 
       } else {
         console.error("No images found in response:", response.data);
       }
     } catch (error) {
       console.error("Error fetching offer details:", error);
     }
   }
  ///////////////////////////
  return (
 <>
 { isLoading? (< div className="loading">  <ClipLoader color="green" size={50}    /></div>):( <>
    <div className="slider-container">
      {/* Main Slider */}
      <Swiper
      centeredSlides={true} // Center the active slide
      spaceBetween={5} // Reduce space between slides
      slidesPerView={"auto"} // Allow slides to adjust automatically
        loop={true}
        keyboard={{ enabled: true }}  // ✅ Enable keyboard navigation
        navigation
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination, Thumbs, Keyboard]}
        thumbs={{ swiper: thumbsSwiper }}
        className="main-slider"
        onInit={(swiper) => {
        
          swiper.el.querySelector(".swiper-button-next").style.color = "green";
          swiper.el.querySelector(".swiper-button-prev").style.color = "green";
          swiper.el.querySelectorAll(".swiper-pagination-bullet").forEach((bullet) => {
            bullet.style.backgroundColor = "green";
          });
          
        }}
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
          <SwiperSlide key={index} >
            <img src={img} alt={`Thumbnail ${index + 1}`} className="thumb-image" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
    <div><Details {...details} /></div> 

   
  </>)}
 </>
  );
};
function Details(props) {
  const[isLiked,setIsLiked]=useState(true);
  const navigate = useNavigate();
  //console.log("detail props: ",props);

  useEffect(() => {
    async function checkFavorite() {
      try {
        const result = await fetchFavoriteOffer(props.id);
        const isFavorited = Array.isArray(result) && result.length > 0 && result[0]?.offerid === props.id;
        setIsLiked(!isFavorited);
        console.log("Favorite fetch result:", result);
        console.log("Is liked set to:", isLiked);
      } catch (error) {
        console.error("Error in checkFavorite:", error);
      }
    }
  
    checkFavorite();
  }, [props.id]);
  
  async function fetchFavoriteOffer(offerID) {
    try {
      const response = await axios.get("http://localhost:3001/FavoriteOffers", {
        params: { offerID },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching favorite offer:", error);
      return [];
    }
  }

  async function handleLikedOffer() {
    setIsLiked(!isLiked);
    console.log("handleLikedOffer ",isLiked);
  
    if (isLiked) {
       await axios.post(
        "http://localhost:3001/AddFavoriteOffers",
        { offerID: props.id },
        { withCredentials: true }
      );
    } else {
       await axios.delete(
        "http://localhost:3001/DeleteFavoriteOffer",
        {
          data: { offerID: props.id }, // ✅ wrap offerID in `data`
          withCredentials: true
        }
      );
    }
  }
  
  return (
    <div className="details-container">
      <h1>Offer information </h1>
      <div>
        <h3>{props.landtitle  }</h3>
      
      </div>
      <h4 id="price">{props.landleaseprice} JOD</h4>
      <table>
        <tbody>
          <tr >
            <td   >
              <strong>Size</strong>
            </td>
            <td   >{props.landsize} m²</td>
          </tr>
          <tr>
            <td   >
              <strong>Rent Duration</strong>
            </td>
            <td   >
              {Math.floor(props.leaseduration/12)===1? "one year":`${Math.floor(props.leaseduration/12)} years`} 
              and {(props.leaseduration%12===1?"one month":`${props.leaseduration%12===1} months`)}</td>
          </tr>
          <tr >
            <td   >
              <strong>Address</strong>
            </td>
            <td   >{props.landlocation }</td>
          </tr>
        </tbody>
      </table>
      <div className="custom-element">
        <LeafLine></LeafLine>
      </div>
      <p>{props.offerdescription }</p>
      <div className="custom-element">
        <LeafLine></LeafLine>
      </div>
      <div className="button-container">
        <Button.Call onClick={()=>{(window.location.href = `tel:${props.PhoneNumber}`)}}>
        
        </Button.Call>
       
        <Button.Chat onClick={() => navigate(`/chat/${props.id}/${props.ownerid}`)} />

       
        <div >
        <Button.Like isLiked={!isLiked} onClick={handleLikedOffer} />

        </div>
      </div>
    </div>
  );
}

export default EcommerceSlider;
