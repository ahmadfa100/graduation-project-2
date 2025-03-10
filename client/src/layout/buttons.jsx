import "./buttons.css";
import { useState } from "react";
import { FaPhoneAlt, FaComments  ,FaHeart, FaRegHeart } from "react-icons/fa";

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
  let [like,likeState]= useState(false);

  function change(){
    likeState(like=!like);
  }
return(
    <button onClick={change} className="custom-button">
    {like? <FaRegHeart /> :  <FaHeart />}
</button>
);
}
export { Call, Chat, Like };
