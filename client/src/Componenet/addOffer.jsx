// src/components/AddOffer.jsx
import "../style/addOffer.css";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import { useNotifications } from '@toolpad/core/useNotifications';


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

export default function AddOffer() {
  const notifications = useNotifications();
  const [images, setImages] = useState([]);
  const [hoveredImage, setHoveredImage] = useState(null);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const previews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...previews]);
  };

  const deleteImage = (index) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const addOfferSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    images.forEach(({ file }) => formData.append("images", file));

    try {
       await axios.post(
        "http://localhost:3001/addOffer",
        formData,
        { withCredentials: true }   
      );
     // console.log(response.data);
     
      notifications.show('Offer saved successfully!', { severity: 'success', autoHideDuration:3000});
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Not authenticated! Redirecting to login...");
        window.location.href = '/login';
        return; // Stop here
      }
      console.error("Error saving offer:", error);
      notifications.show('Error saving offer. Please try again.', { severity: 'error' });
    }
  };

  return (
    <div className="page">
      <div className="add_offer">
        <h3>Land Lease Information</h3>
        <form onSubmit={addOfferSubmit}>
          {/* NO more hidden landOwnerID input! */}
          <div className="group-input">
          
            <input type="text" placeholder="Enter offer title" name="offer_title" minLength="5" maxLength="100" error="hi"/>
            <UnitInput type="number" unit="m²" message="Enter the number of dunums" name="size" />

            <div className="detailed-input">
              <Input type="number" message="Lease duration (years)" name="years" min="0" max="10" />
              <Input type="number" message="Lease duration (months)" name="months" min="0" max="11" />
            </div>

            <UnitInput type="number" unit="JOD" message="Enter price" name="price" min="1" max="100000000" />
            <input type="text" placeholder="Enter location" name="location"  minLength="2" maxLength="100" />
           
        
            <textarea
              className="textInput"
              name="description"
              placeholder="Enter a detailed description"
              rows="5"
              minlength="20" 
              maxlength="500"
              required
            />

            <div className="center">
              <label className="file-upload">
              Recommended: select 4 images 
              (multiple selection allowed)
                <input
                  type="file"
                  multiple
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                  required
                />
              </label>

              {images.length > 0 && (
                <div className="image-preview">
                  {images.map((img, idx) => (
                    <div
                      className="button-image"
                      key={idx}
                      onMouseEnter={() => setHoveredImage(idx)}
                      onMouseLeave={() => setHoveredImage(null)}
                    >
                      <img src={img.preview} alt="preview" />
                      {hoveredImage === idx && (
                        <button
                          type="button"
                          className="delete-button"
                          onClick={() => deleteImage(idx)}
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <button type="submit" className="submit">
                Save and Publish
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
