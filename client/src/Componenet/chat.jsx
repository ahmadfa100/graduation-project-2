import { useState, useEffect } from "react";
import "../style/chat.css";
import { FaCamera, FaPaperPlane, FaUpload } from "react-icons/fa";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";


const socket = io("http://localhost:3001", { autoConnect: false });

function Chat() {
  const [message, setMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [offer, setOffer] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);

  const ownerID = 1;
  const userID = 1;
  const room = `owner${ownerID}user${userID}`;

  useEffect(() => {

    fetchOffer();
    
  const sender=1;
  const receiver = 3;
  const offer = 5;
 
  socket.emit("Initialize", { sender: sender, receiver: receiver, offer: offer});
socket.on("InitialMessages", (id) => {
     console.log("chat  client id:", id);
  fetchChat(id);
});
  
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

  async function fetchChat(chatID){
    // we need to fetch chatmessages not chat

    // try {
    //   const response = await axios.get( `http://localhost:3001/getChat`,{chatID: chatID}  );

    //   console.log("Chat received:", response.data);
    //   if (response.data.error) {
    //     console.log("Error fetching chat:", response.data.error);
    //     return;
    //   }
    //  // setMessages(response.data.messages);
    //  // setLoading(false);
    // } catch (error) {
    //   console.error("Error fetching chat:", error);
    // }
  }
 

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

document.querySelectorAll("input").forEach( element=> element.value = '');

    if(message==null) {return;}

    const messageData = { message, room, sender :userID }; // gpt: Include sender ID
    socket.emit("sendMessage", messageData);

    setMessages((prevMessages) => [
      ...prevMessages,
      { content: message, sender: "sent" },
    ]);
    setMessage(null);
    setPreview(null);
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
            preview={preview}
            setPreview={setPreview}
          />
        </div>
      )}
    </div>
  );
}

function ChatInput({ message, setMessage,preview,setPreview, sendMessage }) {
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
        onChange={(e) => {
          setMessage(e.target.files[0]);
          setPreview(URL.createObjectURL(e.target.files[0]));
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
          
          }
        }}
      />
      <div>
        {preview && (
          <div className="message-preview">
            <img src={preview} alt="Preview" />
          </div>
        )}
      </div>
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
  
const blob = new Blob([content], { type: "image/png" });
const imageUrl = URL.createObjectURL(blob);
  if (typeof content === "string") {
    return (
      <div className="send">
        <div className="message">{content}</div>
      </div>
    );
  } else if (content instanceof ArrayBuffer || content instanceof Uint8Array|| content instanceof File) {
    return (
      <div className="send">
        <img src={imageUrl} alt="chatImage" />
      </div>
    );
  } else {
    return (
      <div className="send">
        <div className="message error-message"> unknown type message❌</div>
      </div>
    );
  }
}

function Receive({ content }) {
   const blob = new Blob([content], { type: "image/png" });
   const imageUrl = URL.createObjectURL(blob);
  if(typeof(content) === "string"){
  return (
    <div className="received">
      <div className="message">{content}</div>
    </div>
  );}
  else if (content instanceof ArrayBuffer || content instanceof Uint8Array) {
    return (
      <div className="received">
        <img src={imageUrl} alt="chatImage" />
      </div>
    );
  } else {
    return (
      <div className="received ">
        <div className="message error-message"> unknown type message❌</div>
      </div>
    );
  }
}

export default Chat;
