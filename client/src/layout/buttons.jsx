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

function Like(params) {
  let [like,likeState]= useState(true);

  function change(){
    likeState(like=!like);
    //params.onClick();
  }
return(
    <button onClick={change} className="custom-button">
    {like? <FaRegHeart /> :  <FaHeart />}
</button>
);
}
export { Call, Chat, Like };
