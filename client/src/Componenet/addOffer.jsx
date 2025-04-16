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
      const response = await axios.post(
        "http://localhost:3001/addOffer",
        formData,
        { withCredentials: true }         // ← include session cookie
      );
      console.log(response.data);
      notifications.show('Offer saved successfully!', { severity: 'success' });
    } catch (error) {
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
            <Input type="text" message="Enter offer title" name="offer_title" />
            <UnitInput type="number" unit="m²" message="Enter the number of dunums" name="size" />

            <div className="detailed-input">
              <Input type="number" message="Lease duration (years)" name="years" min="0" max="100" />
              <Input type="number" message="Lease duration (months)" name="months" min="0" max="11" />
            </div>

            <UnitInput type="text" unit="JOD" message="Enter price" name="price" />
            <Input type="text" message="Enter offer location" name="location" />
            <textarea
              className="textInput"
              name="description"
              placeholder="Enter a detailed description"
              rows="5"
              required
            />

            <div className="center">
              <label className="file-upload">
                Click here to upload images (you can select multiple)
                <input
                  type="file"
                  multiple
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
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
