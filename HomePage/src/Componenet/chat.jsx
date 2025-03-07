import React from "react";
import "../style/chat.css";
import { FaCamera, FaPaperPlane, FaUpload } from "react-icons/fa";
import { Link } from "react-router-dom";

function ChatInput() {
    return (
        <div className="chat-input">
            <button className="icon-btn"><FaCamera /></button>
            <label htmlFor="file-upload" className="upload-label"><FaUpload /></label>
            <input type="file" id="file-upload" className="file-input" name="chatImage" />
            <input type="text" placeholder="Type a message..." />
            <button><FaPaperPlane /></button>
        </div>
    );
}

function Send({ content, date, image }) {
    return (
        <div className="send">
            {image ? (
                <img src={image} alt="sent" className="image-message" />
            ) : (
                <div className="message">{content}</div>
            )}
            <div className="timestamp">{date}</div>
        </div>
    );
}

function Receive({ content, date, image }) {
    return (
        <div className="received">
            {image ? (
                <img src={image} alt="received" className="image-message" />
            ) : (
                <div className="message">{content}</div>
            )}
            <div className="timestamp">{date}</div>
        </div>
    );
}

function Chat(props) {
    return (
        <div className="page">
            <div className="chat-container">
            <div className="chat-header">
               <Link to= "/offer">
               <img src={(props.offer_image) ? props.offer_image :"https://fontawesome.com/icons/image?f=classic&s=solid"} alt="LandImage" />
               </Link>
                <h3>{props.chat_title}</h3>
            </div>

            <div className="chat-box">
                <Send content="Hi, is the land still available?" date={new Date().toLocaleTimeString()} />
                
                <Receive content="Yes, it is! It’s 10 acres, fertile, and perfect for farming" date={new Date().toLocaleTimeString()} />
                <Send content="Can you share some photos?" date={new Date().toLocaleTimeString()} />
                <Receive content="Sure! Here’s a recent one" date={new Date().toLocaleTimeString()} />
                <Receive image="https://cdn.pixabay.com/photo/2022/03/21/02/08/land-7082135_1280.jpg" date={new Date().toLocaleTimeString()} />
                <Send content=" Looks great! What’s the price?" date={new Date().toLocaleTimeString()} />
                <Receive content="The price is $5000/year" date={new Date().toLocaleTimeString()} />

            </div>

            <ChatInput />
        </div>
        </div>
    );
}

export default Chat;