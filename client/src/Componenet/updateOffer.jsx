import "../style/addOffer.css";
import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import { useNotifications } from "@toolpad/core/useNotifications";
import ClipLoader from "react-spinners/ClipLoader";
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
        defaultValue={props.defaultValue}
        required
      />
    </div>
  );
}

function UpdateOffer() {
  const offerID = 5;
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({});
  const notifications = useNotifications();
  const [images, setImages] = useState([]);
  const [hoveredImage, setHoveredImage] = useState(null);

  function handleImageUpload(event) {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      image: file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
  }

  function deleteImage(index) {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  }

  useEffect(() => {
    fetchOffer();
  }, []);

  async function fetchOffer() {
    try {
      const response = await axios.get(`http://localhost:3001/getOffer/${offerID}`);
      console.log("here",response.data.images);
      if (response.data.error) {
        notifications.show(response.data.error, {
          severity: "error",
          autoHideDuration: 3000,
        });
        return;
      }
      setForm(response.data.offer);
      console.log(form);
      setImages(response.data.images.map((image) => ({
        image: image,
        preview: image,
      })));
        setIsLoading(false);
    } catch (error) {
      console.error("Error fetching offer:", error);
    }
  
  }

  async function UpdateOfferSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    images.forEach(({ image }) => {
      formData.append("images", image);
    });

    try {
      await axios.put(`http://localhost:3001/updateOffer/${offerID}`, formData);
      notifications.show("Offer updated successfully!", {
        severity: "success",
        autoHideDuration: 3000,
      });
    } catch (error) {
      console.error("Error updating offer:", error);
      notifications.show("Error updating offer. Please try again.", {
        severity: "error",
        autoHideDuration: 3000,
      });
    }
  }

  return (
    <div className="page">
      <div className="add_offer">
        <h3>Land Lease Information</h3>
      { isLoading? (   <ClipLoader color="green" size={50}    />):
        <form onSubmit={UpdateOfferSubmit}>
     
        <input type="hidden" name="landOwnerID" value="1" />
        <div className="group-input">
          <input className="textInput" type="text" placeholder="Enter offer title" name="offer_title" defaultValue={form.landtitle} required />
          <UnitInput type="number" unit="m²" message="Enter land size" name="size" defaultValue={form.landsize} />

          <div className="detailed-input">
           
            <input className="textInput" type="number" placeholder="Lease duration (years)" name="years" min="0" max="100"  defaultValue={form.leaseduration ? Math.floor(form.leaseduration / 12) : ""}  />
            <input className="textInput" type="number" placeholder="Lease duration (months)" name="months" min="0" max="12" defaultValue={form.leaseduration ? (form.leaseduration % 12) : ""}/>
          </div>

          <UnitInput type="text" unit="JOD" message="Enter price" name="price" defaultValue={form.landleaseprice} />
          <input className="textInput" type="text" placeholder="Enter offer location (e.g., Amman Sweileh)" name="location" defaultValue={form.landlocation} />
          <textarea className="textInput" name="description" placeholder="Enter a detailed description" rows="5" required defaultValue={form.offerdescription}></textarea>

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
      }
      </div>
    </div>
  );
}

export default UpdateOffer;
