import { useState } from "react";
import "../style/offerdetail.css";
import LeafLine from "../layout/leafLine";
import * as Button from "../layout/buttons";

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
        <h3>{props.title}</h3>
      </div>
      <h4 id="price">{props.price} JOD</h4>
      <table>
        <tbody>
          <tr style={{ backgroundColor: "#f5f5f5" }}>
            <td style={cellStyle}>
              <strong>Size</strong>
            </td>
            <td style={cellStyle}>{props.size} Dunums</td>
          </tr>
          <tr>
            <td style={cellStyle}>
              <strong>Rental Term</strong>
            </td>
            <td style={cellStyle}>{props.RentalType}</td>
          </tr>
          <tr style={{ backgroundColor: "#f5f5f5" }}>
            <td style={cellStyle}>
              <strong>Address</strong>
            </td>
            <td style={cellStyle}>{props.location}</td>
          </tr>
        </tbody>
      </table>
      <div className="custom-element">
        <LeafLine></LeafLine>
      </div>
      <p>{props.description}</p>
      <div className="custom-element">
        <LeafLine></LeafLine>
      </div>
      <div className="button-container">
        <Button.Call></Button.Call>
        <Button.Chat></Button.Chat>
        <Button.Like></Button.Like>
      </div>
    </div>
  );
}
///////////////////////////////////////////////
const OfferDetails = (props) => {
  const [mainImage, setMainImage] = useState("./Lands/Land_1.jpg");

  const thumbnails = [
    "./content images/tomatoes-growing-garden.jpg",
    "./Lands/Zitonjpg.jpg",
    "./Lands/Map.jpg",
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const changeImage = (index) => {
    setMainImage(thumbnails[index]);
    setActiveIndex(index);
  };

  return (
    <div className="page">
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

      <div className="slider-container">{Details(props)}</div>
    </div>
  );
};

export default OfferDetails;
