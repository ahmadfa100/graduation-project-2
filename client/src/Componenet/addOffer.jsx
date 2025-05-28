import "../style/addOffer.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaImage } from "react-icons/fa";
import axios from "axios";
import { useNotifications } from '@toolpad/core/useNotifications';

function UnitInput(props) {
  return (
    <div className="unit-Input">
      <input
        className="textInput composite"
        type={props.type}
        placeholder={props.message}
        name={props.name}
        max={props.max}
        min={props.min}
        required
      />
      <span className="unit">{props.unit}</span>
    </div>
  );
}

export default function AddOffer() {
  const notifications = useNotifications();
  const [images, setImages] = useState([]);
  const [hoveredImage, setHoveredImage] = useState(null);
  const navigate = useNavigate();

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
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/addOffer`,
        formData,
        { withCredentials: true }   
      );
     
      notifications.show(<>Offer saved successfully! <div className="notification" onClick={()=>{ navigate(`/OfferDetails/${response.data.offerId}`)}}>[Click here to preview it]</div></>, {
        severity: "success",
        autoHideDuration: 3000,
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Not authenticated! Redirecting to login...");
        window.location.href = '/login';
        return; 
      }
      console.error("Error saving offer:", error);
      notifications.show('Error saving offer. Please try again.', { severity: 'error' });
    }
  };

  return (
    <div className="page">
      <div className="add_offer">
        <h3>Create New Land Lease Offer</h3>
        <form onSubmit={addOfferSubmit}>
          <div className="group-input">
            <div>
              <label>Offer Title</label>
              <input 
              className="textInput"
                type="text" 
                message="Enter a descriptive title for your offer" 
                name="offer_title" 
                minLength="5" 
                maxLength="100" 
                required
              />

            </div>

            <div>
              <label>Land Area</label>
              <UnitInput 
                type="number" 
                unit="m²" 
                message="Enter area in square meters" 
                name="size"
                min="10" 
                max="100000000" 
              />
            </div>

            <div>
              <label>Lease Duration</label>
              <div className="detailed-input">
                <input 
                className="textInput"
                  type="number" 
                  message="Years" 
                  name="years" 
                  min="0" 
                  max="10" 
                  required
                />
                <input 
                className="textInput"
                  type="number" 
                  message="Months" 
                  name="months" 
                  min="0" 
                  max="11" 
                  required
                />
              </div>
            </div>

            <div>
              <label>Price</label>
              <UnitInput 
                type="number" 
                unit="JOD" 
                message="Enter price in Jordanian Dinar" 
                name="price" 
                min="1" 
                max="100000000" 
              />
            </div>

            <div>
              <label>Location</label>
              <input 
              className="textInput"
                type="text" 
                message="Enter the exact location" 
                name="location" 
                minLength="5" 
                maxLength="100" 
                required
              />
            </div>

            <div>
              <label>Description</label>
              <textarea
                className="textInput"
                name="description"
                placeholder="Provide detailed information about the land, its features, and any specific requirements"
                rows="5"
                minLength="20" 
                maxLength="500"
                required
              />
            </div>

            <div>
              <label>Images</label>
              <label className="file-upload">
                <FaImage style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#38a169' }} />
                <div>Click to select images</div>
                <div style={{ fontSize: '0.8rem', color: '#4a5568', marginTop: '0.5rem' }}>
                  Recommended: 4 images (multiple selection allowed)
                </div>
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
            </div>

            <button type="submit" className="submit">
              Publish Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
