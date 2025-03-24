import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation, Pagination, Thumbs, Keyboard,} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "../style/offerdetail.css";

const EcommerceSlider = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const productImages = [
    "https://cdn.pixabay.com/photo/2022/05/11/09/13/data-7188894_1280.jpg",
    "https://cdn.pixabay.com/photo/2023/03/22/12/40/ai-generated-7869380_1280.jpg",
    "https://cdn.pixabay.com/photo/2018/11/14/08/32/binary-code-3814663_1280.jpg",
    "https://cdn.pixabay.com/photo/2024/05/21/19/57/computer-8779039_1280.jpg",
  ];

  return (
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
      style={
        {
         
        }
      }
      >
        {productImages.map((img, index) => (
          <SwiperSlide key={index}>
            <img src={img} alt={`Thumbnail ${index + 1}`} className="thumb-image" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default EcommerceSlider;
