import "./buttons.css";
import { useState } from "react";
import { FaPhoneAlt, FaComments  ,FaHeart, FaRegHeart } from "react-icons/fa";

function Call(params) {
  return (
    <button className="custom-button" onClick={params.onClick}>
      <FaPhoneAlt /> Call
    </button>
  );
}

function Chat(params) {
  return (
    <button className="custom-button" onClick={params.onClick}>
      <FaComments /> Chat
    </button>
  );
}


function Like({ isLiked, onClick }) {
  return (
    <button onClick={onClick} className="custom-button">
      {isLiked ? <FaHeart /> : <FaRegHeart />}
    </button>
  );
}
export { Call, Chat, Like };
