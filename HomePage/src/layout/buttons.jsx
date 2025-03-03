import "./buttons.css";
import { useState } from "react";
import { FaPhoneAlt, FaComments } from "react-icons/fa";

function Call() {
  return (
    <button className="custom-button">
      <FaPhoneAlt /> Call
    </button>
  );
}

function Chat() {
  return (
    <button className="custom-button">
      <FaComments /> Chat
    </button>
  );
}

function Like() {
return(
    <button className="custom-button">
    <img src="./content images/heart_after.png" alt="like"  className="icon"/>
</button>
);
}


export { Call, Chat, Like };
