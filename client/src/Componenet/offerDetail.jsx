import { useState,useEffect } from "react";
import "../style/offerdetail.css";
import LeafLine from "../layout/leafLine";
import * as Button from "../layout/buttons";
import { Link } from "react-router-dom";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

const cellStyle = {
  border: "1px solid #ccc",
  borderRadius: "5px",
  margin: "5px",
  boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
  padding: "10px",
  cursor: "pointer",
  width: "10%",
  height: "20%",
};
function Details(props) {
  return (
    <div className="slider-container details">
      <h1>Offer information </h1>
      <div>
        <h3>{props.landtitle  }</h3>
      
      </div>
      <h4 id="price">{props.landleaseprice} JOD</h4>
      <table>
        <tbody>
          <tr style={{ backgroundColor: "#f5f5f5" }}>
            <td style={cellStyle}>
              <strong>Size</strong>
            </td>
            <td style={cellStyle}>{props.landsize} m²</td>
          </tr>
          <tr>
            <td style={cellStyle}>
              <strong>Rent Duration</strong>
            </td>
            <td style={cellStyle}>
              {Math.floor(props.leaseduration/12)===1? "one year":`${Math.floor(props.leaseduration/12)} years`} 
              and {(props.leaseduration%12===1?"one month":`${props.leaseduration%12===1} months`)}</td>
          </tr>
          <tr style={{ backgroundColor: "#f5f5f5" }}>
            <td style={cellStyle}>
              <strong>Address</strong>
            </td>
            <td style={cellStyle}>{props.landlocation }</td>
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
        <Button.Call></Button.Call>
       <Link to="/chat">
       <Button.Chat></Button.Chat>
       </Link>
        <Button.Like></Button.Like>
      </div>
    </div>
  );
}
///////////////////////////////////////////////
 const OfferDetails = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState([]);
  const [mainImage, setMainImage] = useState();

  const [thumbnails,setThumbnails] = useState([]);
  
  const [activeIndex, setActiveIndex] = useState(0);

  const changeImage = (index) => {
    setMainImage(thumbnails[index]);
    setActiveIndex(index);
  };

  useEffect(() => {
   fetchoffer();
  }, []);
  async function fetchoffer() {
    const offerID = 5;
    try {
      const response = await axios.get(`http://localhost:3001/getOffer/${offerID}`);
      
      console.log("Full server response:", response.data);
      console.log("here",response.data.images);
      if (response.data && response.data.images) {
        setDetails(response.data.offer);
        setMainImage(response.data.images[0]);
        setThumbnails(response.data.images);
        setIsLoading(false);


      } else {
        console.error("No images found in response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching offer details:", error);
    }
  }
 // console.log("here =>",details);

  return (
    <div className="page">
   {
    isLoading? (
      <ClipLoader color="green" size={50}    />
    ) : (
<div>
<div className="slider-container">
      <div className="main-slide">
        <img id="mainImage" src={mainImage} alt="Main Slide" />
      </div>
      <div className="thumbnail-container">
        {thumbnails.map((thumb, index) => (
          <img
            key={index}
            src={thumb}
            alt={`Thumb ${index + 1}`}
            onClick={() => changeImage(index)}
            className={activeIndex === index ? "active" : ""}
          />
        ))}
      </div>

      <div className="pagination-dots">
        {thumbnails.map((_, index) => (
          <span
            key={index}
            onClick={() => changeImage(index)}
            className={activeIndex === index ? "active" : ""}
          ></span>
        ))}
      </div>
    </div>

    <div className="slider-container">{Details(details)}</div>
</div>
    )
   }
    </div>
  );
};

export default OfferDetails;
