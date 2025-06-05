import "../style/addOffer.css";
import { useState, useEffect } from "react";
import { FaTrash, FaImage } from "react-icons/fa";
import axios from "axios";
import { useNotifications } from "@toolpad/core/useNotifications";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate, useParams } from "react-router-dom";

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
        defaultValue={props.defaultValue}
        required
      />
      <span className="unit">{props.unit}</span>
    </div>
  );
}



function UpdateOffer() {
  const {offerID}=useParams(); 
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({});
  const notifications = useNotifications();
  const [images, setImages] = useState([]);
  const [hoveredImage, setHoveredImage] = useState(null);
const navigate= useNavigate();

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
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/getOffer/${offerID}`);
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
      if (error.response && error.response.status === 401) {
        console.log("Not authenticated! Redirecting to login...");
        window.location.href = '/login';
        return; 
      }
      console.error("Error fetching offer:", error);
      notifications.show('Error fetching offer. Please try again.', { severity: 'error' });
      setIsLoading(false);
    }
  }

  async function UpdateOfferSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

  
    images.forEach(({ image }) => {
      if (image instanceof File) {
         formData.append("images", image);
      } else {
       
      }
    });

    try {
      await axios.put(`${process.env.REACT_APP_SERVER_URL}/updateOffer/${offerID}`, formData,{ withCredentials: true } );
      notifications.show(<>Offer updated successfully! <div className="notification" onClick={()=>{ navigate(`/OfferDetails/${offerID}`)}}>[Click here to preview it]</div></>, {
        severity: "success",
        autoHideDuration: 3000,
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Not authenticated! Redirecting to login...");
        window.location.href = '/login';
        return; 
      }
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
        <h3>Update Land Lease Offer</h3>
      { isLoading? (  <div className="addOffer-loader"> <ClipLoader color="green" size={50}    /></div>): (
        <form onSubmit={UpdateOfferSubmit}>
        <div className="group-input">

          <div>
            <label>Offer title</label>
            <input 
            className="textInput"
              type="text" 
              message="Enter offer title" 
              name="offer_title" 
              defaultValue={form.landtitle} 
              minLength="5" 
              maxLength="100" 
              required
            />
          </div>

          <div>
            <label>Land area</label>
            <UnitInput 
              type="number" 
              unit="m²" 
              message="Enter area in square meters" 
              name="size" 
              defaultValue={form.landsize} 
              min="10" 
              max="100000000" 
            />
          </div>

          <div>
            <label>Lease duration</label>
            <div className="detailed-input">
              <input 
              className="textInput"
                type="number" 
                message="Years" 
                name="years" 
                min="0" 
                max="100"  
                defaultValue={form.leaseduration ? Math.floor(form.leaseduration / 12) : ""}  
                required
              />
              <input 
              className="textInput"
                type="number" 
                message="Months" 
                name="months" 
                min="0" 
                max="12" 
                defaultValue={form.leaseduration ? (form.leaseduration % 12) : ""}
                required
              />
            </div>
          </div>

          <div>
            <label>Price</label>
            <UnitInput 
              type="number" 
              unit="JOD" 
              message="Enter price" 
              name="price" 
              defaultValue={form.landleaseprice}  
              min="0" 
              max="100000000"  
            />
          </div>

          <div>
            <label>Location</label>
            <input 
            className="textInput"
              type="text" 
              message="Enter offer location (e.g., Amman Sweileh)" 
              name="location" 
              defaultValue={form.landlocation}  
              minLength="2" 
              maxLength="100" 
              required
            />
          </div>

          <div>
            <label>Description</label>
            <textarea 
              className="textInput" 
              name="description" 
              placeholder="Enter a detailed description"
              rows="5" 
              required 
              defaultValue={form.offerdescription} 
              minLength="20" 
              maxLength="500">
            </textarea>
          </div>

          <div>
            <label>Images</label>
            <label className="file-upload">
              <FaImage style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#38a169' }} />
              <div>Click to select images</div>
              <div style={{ fontSize: '0.8rem', color: '#4a5568', marginTop: '0.5rem' }}>
                Recommended: 4 images (multiple selection allowed)
              </div>
              <input type="file" multiple hidden accept="image/*" onChange={handleImageUpload} required/>
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
          </div>

          <button type="submit" className="submit">
            Update Offer
          </button>
        </div>
      </form>
      )}
      </div>
    </div>
  );
}

export default UpdateOffer;
