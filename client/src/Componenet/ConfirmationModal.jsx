import React from "react";
import { FaTimes } from "react-icons/fa";
import "../style/ConfirmationModal.css"; 

export default function ConfirmationModal({ open, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="confirmation-backdrop">
      <div className="confirmation-dialog">
        <div className="confirmation-header">
          <h3>Confirm Delete</h3>
          <button className="close-btn" onClick={onCancel}>
            <FaTimes />
          </button>
        </div>
        <p className="confirmation-message">{message}</p>
        <div className="confirmation-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
