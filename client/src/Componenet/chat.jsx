import { useState, useEffect } from "react";
import "../style/chat.css";
import { FaCamera, FaPaperPlane, FaUpload } from "react-icons/fa";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

const socket = io("http://localhost:3001"); // Ensure socket is initialized once

function Chat() {
  const [message, setMessage] = useState(""); // Input message
  const [messages, setMessages] = useState([]); // Stores all messages
  const [offer, setOffer] = useState(null);
  const [isLoading, setLoading] = useState(true);

  // Define room ID dynamically
  const ownerID = 1;
  const userID = 1;
  const room = `owner${ownerID}user${userID}`;

  useEffect(() => {
    socket.emit("join", room);
    return () => {
      socket.emit("leave", room); // Leave the room when component unmounts
    };
  }, [room]);

  // Fetch offer data
  useEffect(() => {
    fetchOffer();
  }, []);

  async function fetchOffer() {
    const offerID = 5;
    try {
      const response = await axios.get(
        `http://localhost:3001/getOffer/${offerID}`
      );
      console.log("Offer received:", response.data);
      if (response.data.error) {
        console.log("Error fetching offer:", response.data.error);
        return;
      }
      setOffer(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching offer:", error);
    }
  }

  // Listen for incoming messages
  useEffect(() => {
    socket.on("RecivedMessage", ({ message }) => {
      console.log("Received message:", message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: message, sender: "received" },
      ]);
    });

    return () => socket.off("RecivedMessage"); // Cleanup listener
  }, []);

  // Handle sending message
  const sendMessage = () => {
    if (message.trim() === "") return; // Prevent empty messages

    socket.emit("sendMessage", { message, room }); // Send message with room ID

    // Update UI immediately with the sent message
    setMessages((prevMessages) => [
      ...prevMessages,
      { content: message, sender: "sent" },
    ]);
    setMessage(""); // Clear input
  };

  return (
    <div className="chat-page">
      {isLoading ? (
        <ClipLoader color="green" size={50} />
      ) : (
        <div className="chat-container">
          <div className="chat-header">
            <Link to="/offer">
              <img src={offer.images[0]} alt="LandImage" />
            </Link>
            <h3>{offer.offer.landtitle}</h3>
          </div>

          <div className="chat-box">
            {messages.map((msg, index) =>
              msg.sender === "sent" ? (
                <Send
                  key={index}
                  content={msg.content}
                  date={new Date().toLocaleTimeString()}
                />
              ) : (
                <Receive
                  key={index}
                  content={msg.content}
                  date={new Date().toLocaleTimeString()}
                />
              )
            )}
          </div>

          <ChatInput
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
          />
        </div>
      )}
    </div>
  );
}

// Chat input component
function ChatInput({ message, setMessage, sendMessage }) {
  return (
    <div className="chat-input">
      <button className="icon-btn">
        <FaCamera />
      </button>
      <label htmlFor="file-upload" className="upload-label">
        <FaUpload />
      </label>
      <input
        type="file"
        id="file-upload"
        className="file-input"
        name="chatImage"
      />
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
          }
        }}
      />
      <button onClick={sendMessage}>
        <FaPaperPlane />
      </button>
    </div>
  );
}

// Sent message component
function Send({ content, date }) {
  return (
    <div className="send">
      <div className="message">{content}</div>
      <div className="timestamp">{date}</div>
    </div>
  );
}

// Received message component
function Receive({ content, date }) {
  return (
    <div className="received">
      <div className="message">{content}</div>
      <div className="timestamp">{date}</div>
    </div>
  );
}

export default Chat;
