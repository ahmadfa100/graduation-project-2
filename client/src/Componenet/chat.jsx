import { useState, useEffect } from "react";
import "../style/chat.css";
import { FaCamera, FaPaperPlane, FaUpload } from "react-icons/fa";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

const socket = io("http://localhost:3001", { autoConnect: false });

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [offer, setOffer] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const ownerID = 1;
  const userID = 1;
  const room = `owner${ownerID}user${userID}`;

  useEffect(() => {
    socket.connect();
    socket.emit("join", room);

    socket.on("RecivedMessage", (newMessage) => {
      console.log("Received message:", newMessage);

      // gpt: Ignore messages that were sent by this user
      
        setMessages((prevMessages) => [
          ...prevMessages,
          { content: newMessage.message, sender: "received" },
        ]);
      
    });

    return () => {
      socket.off("RecivedMessage");
      socket.disconnect();
    };
  }, [room]);

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

  const sendMessage = () => {
    if (message.trim() === "") return;

    const messageData = { message, room }; // gpt: Include sender ID
    socket.emit("sendMessage", messageData);

    setMessages((prevMessages) => [
      ...prevMessages,
      { content: message, sender: "sent" },
    ]);
    setMessage("");
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
                <Send key={index} content={msg.content} />
              ) : (
                <Receive key={index} content={msg.content} />
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

function Send({ content }) {
  return (
    <div className="send">
      <div className="message">{content}</div>
    </div>
  );
}

function Receive({ content }) {
  return (
    <div className="received">
      <div className="message">{content}</div>
    </div>
  );
}

export default Chat;
