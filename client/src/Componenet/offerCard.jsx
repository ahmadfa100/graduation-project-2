import React, { useState } from "react";
import {
  FaPhone,
  FaComments,
  FaHeart,
  FaRegHeart,
  FaEdit,
  FaTrash
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "./ConfirmationModal"; 
export default function OfferCard({
  offer,
  isFavorite,
  onToggleFavorite,
  showEdit = false,
  onEdit,
  onDelete
}) {
  const navigate = useNavigate();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const price = parseFloat(offer.landLeasePrice);
  const area  = parseFloat(offer.landSize);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    setIsConfirmOpen(false);
    if (onDelete && typeof onDelete === "function") {
      onDelete(offer.id);
    }
  };

  const cancelDelete = () => {
    setIsConfirmOpen(false);
  };

  return (
    <>
      <div
        className="offer-item"
        onClick={() => navigate(`/OfferDetails/${offer.id}`)}
      >
        <div className="offer-image-container">
          <img
            src={offer.image}
            alt={offer.landTitle}
            className="offer-image"
          />
        </div>

        <div className="offer-details">
          <div className="offer-header">
            <h3 className="offer-title">{offer.landTitle}</h3>
            <span className="offer-price">
              {!isNaN(price) ? price.toFixed(2) : offer.landLeasePrice} JOD
            </span>
          </div>

          <p className="offer-subtitle">
            Land area:{" "}
            {!isNaN(area) ? area.toFixed(2) : offer.landSize} m<sup>2</sup>, location:{" "}
            {offer.landLocation}
          </p>

          <div className="offer-actions">
            {showEdit ? (
              <>
                <button
                  className="action-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(offer.id);
                  }}
                >
                  <FaEdit />
                </button>
                
                <button
                  style={{ background: "red" }}
                  className="action-button"
                  onClick={handleDeleteClick}
                >
                  <FaTrash />
                </button>
              </>
            ) : (
              <>
                <button
                  className="action-button"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaPhone />
                </button>
                <button
                  className="action-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/chat");
                  }}
                >
                  <FaComments />
                </button>
                <button
                  className="action-button favorite-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(offer.id);
                  }}
                >
                  {isFavorite ? <FaHeart /> : <FaRegHeart />}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        open={isConfirmOpen}
        message={`Are you sure you want to delete “${offer.landTitle}”?`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
}
