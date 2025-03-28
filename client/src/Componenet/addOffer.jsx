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

function AddOffer() {

  const notifications = useNotifications();
  const [images, setImages] = useState([]);
  const [hoveredImage, setHoveredImage] = useState(null);

  function handleImageUpload(event) {
    const files = Array.from(event.target.files);
    const images = files.map((file) => ({
      image : file,
      preview:URL.createObjectURL(file)
    }));
  
    setImages((prev) => [...prev, ...images]);
  }

  function deleteImage(index) {

    setImages((prevImages) => {
      const newImages = [...prevImages];
      URL.revokeObjectURL(newImages[index].preview); // Free memory
      return newImages.filter((_, i) => i !== index);
    });
  }

  async function addOfferSubmit(event) {  
    event.preventDefault();
    const formData = new FormData(event.target);
    images.forEach(({ image }) => {
      formData.append("images", image);
    });
    
    try {
      const response = await axios.post("http://localhost:3001/addOffer", formData);
      console.log(response.data);
      
      notifications.show('Offer saved successfully!', {
         severity: 'success',
         autoHideDuration: 3000,
       
       
      });
    } catch (error) {
      console.error("Error saving offer:", error);
      notifications.show('Error saving offer. Please try again.', {
        severity: 'Error',
        autoHideDuration: 3000,
      
     });
    }
  }

  return (
    <div className="page">
      <div className="add_offer">
        <h3>Land Lease Information</h3>
        <form onSubmit={addOfferSubmit}>
          <input type="hidden" name="landOwnerID" value="1" />
          <div className="group-input">
            <Input type="text" message="Enter offer title" name="offer_title" />
            <UnitInput type="number" unit="m²" message="Enter the number of dunums" name="size" />
            
            <div className="detailed-input">
              <Input type="number" message="Lease duration (years)" name="years" min="0" max="100" />
              <Input type="number" message="Lease duration (months)" name="months" min="0" max="12" />
            </div>
            
            <UnitInput type="text" unit="JOD" message="Enter price" name="price" />
            <Input type="text" message="Enter offer location (e.g., Amman Sweileh)" name="location" />
            <textarea className="textInput" name="description" placeholder="Enter a detailed description of the land and the offer" rows="5" required></textarea>

            <div className="center">
              <label className="file-upload">
                Click here to upload images (you can select multiple images)
                <input type="file" multiple hidden accept="image/*" onChange={handleImageUpload} />
              </label>

              {images.length > 0 && (
                <div className="image-preview">
                  {images.map((image, index) => (
                    <div
                      className="button-image"
                      key={index}
                      onMouseEnter={() => setHoveredImage(index)}
                      onMouseLeave={() => setHoveredImage(null)}
                    >
                      <img src={image.preview} alt="preview" />
                      {hoveredImage === index && (
                        <button type="button" className="delete-button" onClick={() => deleteImage(index)}>
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

export default AddOffer;
