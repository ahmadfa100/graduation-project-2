import "../style/addOffer.css";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import axios from "axios";

function UnitInput(props) {
  return (
    <div className="unit-Input">
      <span className="unit">{props.unit}</span>
      <input
        className="textInput composite"
        type={props.type}
        placeholder={props.message}
        name={props.name}
        max={props.max}
        min={props.min}
        required
      />
    </div>
  );
}

function Input(props) {
  return (
    <input
      className="textInput"
      type={props.type}
      placeholder={props.message}
      name={props.name}
      required
      min={props.min}
      max={props.max}
    />
  );
}

function AddOffer(props) {
  const [images, setImages] = useState([]);
  const [hoverdImage, setHoverdImage] = useState(null);

  function handleImageUpload(event) {
    const files = Array.from(event.target.files);
    const imagesUrl = files.map((file) => URL.createObjectURL(file));
    setImages((previous) => [...previous, ...imagesUrl]);
  }

  function deleteImage(index) {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  }

 async function addOfferSubmit(event) {  
    
    event.preventDefault();
    const formdata= new FormData(event.target);
    const data = Object.fromEntries(formdata);
  
    console.log(data.months);
    const response = await axios.post("http://localhost:3500",data);
    // Add your code to save the offer to the database here
    console.log("Offer saved successfully!");
  }


  return (
    <div className="page">
      <div className="add_offer">
        <h3>Land Lease Information</h3>
        <form onSubmit={addOfferSubmit}>
          <div className="group-input">
            <Input type="text" message="Enter offer title" name="offer_title" />
            <UnitInput type="text" unit="m²" message="Enter the number of dunums" name="size" />
            
            <div className="detailed-input">
              <Input type="number" message="Lease duration (years)" name="years" min="0" max="100" />
              <Input type="number" message="Lease duration (months)" name="months" min="0" max="12" />
            </div>
            
            <UnitInput type="text" unit="JOD" message="Enter price" name="price" />
            <Input type="text" message="Enter offer location (e.g., Amman Sweileh)" name="location" />
            <textarea className="textInput" placeholder="Enter a detailed description of the land and the offer" rows="5" required></textarea>

            <div className="center">
              <label className="file-upload">
                Click here to upload images (you can select multiple images)
                <input type="file" multiple hidden accept="image/*" onChange={handleImageUpload}  />
              </label>

              {images.length > 0 && (
                <div className="image-preview">
                  {images.map((image, index) => (
                   <div
                   className="button-image"
                   key={index}
                   onMouseEnter={() => setHoverdImage(index)}
                   onMouseLeave={() => setHoverdImage(null)}
                 >
                   <img src={image} alt="preview" />
                   {hoverdImage === index && (
                     <button type="button" className="delete-button" onClick={() => deleteImage(index)}>
                       <FaTrash />
                     </button>
                   )}
                 </div>
                 
                  ))}
                </div>
              )}

              <button type="submit" className="submit" >
                Save and Publish
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
 
}

export default AddOffer;
