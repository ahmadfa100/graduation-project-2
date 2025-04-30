import { useState, useEffect } from "react";
import "../style/chat.css";
import { FaCamera, FaPaperPlane, FaUpload } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

const socket = io("http://localhost:3001", { autoConnect: false });

function MainChat(props) {
  const [message, setMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [preview, setPreview] = useState(null);
  const [isChatLoding, setChatLoading] = useState(true);
  const [sessiondata, setSessiondata] = useState(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [offerID, setOfferID] = useState(null);
  const [ReceiverID, setReceiverID] = useState(null);
  const { paramReceiverID, paramOfferID } = useParams();
  const [chatData, setChatData] = useState({});
  const [room, setRoom] = useState(null);
  const [isChatDataLoading, setIsChatDataLoading] = useState(true);

  useEffect(() => {
    console.log("chat params:", paramReceiverID);
    fetchSession();
  }, []);

  useEffect(() => {
    if (props.chatListData && props.chatListData.offerID) {
      setOfferID(props.chatListData.offerID);
      setReceiverID(props.chatListData.otherParticipantID);
    } else {
      setOfferID(paramOfferID);
      setReceiverID(paramReceiverID);
    }
  }, [props.chatListData, paramOfferID, paramReceiverID]);

  useEffect(() => {
    console.log("offerID, ReceiverID", offerID, ReceiverID);
    fetchChatData(offerID, ReceiverID);
  }, [offerID, ReceiverID, sessiondata]);

  useEffect(() => {
    setRoom(chatData.chatid);
    console.log("chatData ", chatData);
  }, [chatData]);

  useEffect(() => {
    setMessages([]);
  }, [offerID, ReceiverID]);

  useEffect(() => {
    //console.log("enter");
    if (!sessionReady || sessiondata === null) return;
    //console.log("vaild");
    setMessages([]);
    setMessage(null);

    socket.emit("Initialize", {
      sender: sessiondata.userID,
      receiver: chatData.participantid,
      offer: offerID,
    }); 
    socket.on("InitialMessages", (id) => {
      fetchChat(id);
    });

    socket.connect();
    socket.emit("join", room);

    socket.on("RecivedMessage", (newMessage) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          content: newMessage.message,
          sender: "received",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    });

    return () => {
      socket.off("RecivedMessage");
      socket.disconnect();
    };
  }, [
    sessionReady,
    sessiondata,
    room,
    offerID,
    ReceiverID,
    chatData.participantid,
  ]);

  const fetchChatData = async (offerID, userID) => {
    try {
      const response = await axios.get("http://localhost:3001/getChatData", {
        params: { offerID, userID },
        withCredentials: true,
      });

      console.log("ChatID data:", response.data);

      setChatData(response.data);
      setIsChatDataLoading(false);
      //console.log("chatID :",chatID);
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
      } else {
        console.error("Request error:", error.message);
      }
      return null;
    }
  };

  async function fetchSession() {
    try {
      const sessionResponse = await axios.get(
        `http://localhost:3001/sessionInfo`,
        {
          withCredentials: true,
        }
      );
      const user = sessionResponse.data.user;

      if (user) {
        setSessiondata({
          userID: sessionResponse.data.user.id,
        });
        setSessionReady(true);
        //console.log("Session data:", user);
      } else {
        console.log("No user found in session.");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        console.log("Not authenticated! Redirecting to login...");
        window.location.href = "/login";
        return;
      }
      console.error("Failed to fetch session info:", err);
    }
  }
  async function fetchChat(chatID) {
    try {
      // console.log("Fetching chat messages...");
      const response = await axios.get(
        `http://localhost:3001/getchatcontent/`,
        { params: { chatID } }
      );

      if (response.data.error) {
        return;
      }
      if (response.data === "Not Found") {
        console.log("No chat messages available.");
        setChatLoading(false);
      } else {
        const oldMessages = response.data;
        //  console.log(Array.isArray(oldMessages)); // Should print true
        console.log("messages:", oldMessages);
        oldMessages.forEach((element) => {
          if (element.senderid === sessiondata.userID) {
            if (element.contenttext) {
              setMessages((prevMessages) => [
                ...prevMessages,
                {
                  content: element.contenttext,
                  sender: "sent",
                  time: new Date(element.sent_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                },
              ]);
            } else if (element.contentfile) {
              // console.log("image from db type: " + element.contentfile,"the actual image is: " +element.contentfile.data); //line 1
              setMessages((prevMessages) => [
                ...prevMessages,
                {
                  content: new Uint8Array(element.contentfile.data),
                  sender: "sent",
                  time: new Date(element.sent_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                },
              ]);
            }
          } else if (element.senderid === ReceiverID) {
            if (element.contenttext) {
              setMessages((prevMessages) => [
                ...prevMessages,
                {
                  content: element.contenttext,
                  sender: "received",
                  time: new Date(element.sent_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                },
              ]);
            } else if (element.contentfile) {
              setMessages((prevMessages) => [
                ...prevMessages,
                {
                  content: new Uint8Array(element.contentfile.data),
                  sender: "received",
                  time: new Date(element.sent_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                },
              ]);
            }
          }
        });
        setChatLoading(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Not authenticated! Redirecting to login...");
        window.location.href = "/login";
        return;
      }
      setChatLoading(false);
      console.error("Error fetching chat:", error);
    }
  }

  const sendMessage = () => {
    document
      .querySelectorAll("input")
      .forEach((element) => (element.value = ""));

    if (message == null) {
      return;
    }

    const messageData = { message, room, sender: sessiondata.userID }; // gpt: Include sender ID
    socket.emit("sendMessage", messageData);

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        content: message,
        sender: "sent",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setMessage(null);
    setPreview(null);
  };

  return (
    <div className="chat-page">
      {isChatDataLoading ? (
        <ClipLoader color="green" size={50} />
      ) : (
        <div className="chat-container">
          <div className="chat-header">
            <div className="chat-offer-header">
              <Link to="/offer">
                {chatData.offerImage && (
                  <img
                    src={`data:image/jpeg;base64,${chatData.offerImage}`}
                    alt="land"
                  />
                )}
              </Link>
              <h3>{chatData.landtitle || ""}</h3>
            </div>
            <div className="chat-owner">
              {" "}
              <h4>
                {chatData.firstname || " "} {chatData.lastname || " "}
              </h4>
            </div>
          </div>

          <div className="chat-box">
            {messages.map((msg, index) =>
              msg.sender === "sent" ? (
                <Send key={index} content={msg.content} time={msg.time} />
              ) : (
                <Receive key={index} content={msg.content} time={msg.time} />
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

function ChatInput({ message, setMessage, preview, setPreview, sendMessage }) {
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

function Send({ content, time }) {
  
  if (typeof content === "string") {
    return (
      <div className="send">
        <div className="message">{content}</div>
        <div className="timestamp">{time}</div>
      </div>
    );
  } else if (
    content instanceof ArrayBuffer ||
    content instanceof Uint8Array ||
    content instanceof File
  ) {
    const blob = new Blob([content], { type: "image/png" });
    const imageUrl = URL.createObjectURL(blob);
    return (
      <div className="send">
        <img src={imageUrl} alt="chatImage" />
        <div className="timestamp">{time}</div>
      </div>
    );
  } else {
    return (
      <div className="send">
        <div className="message error-message"> unknown type message❌</div>
        <div className="timestamp">{time}</div>
      </div>
    );
  }
}

function Receive({ content, time }) {
  if (typeof content === "string") {
    return (
      <div className="received">
        <div className="message">{content}</div>
        <div className="timestamp">{time}</div>
      </div>
    );
  } else if (content instanceof ArrayBuffer || content instanceof Uint8Array) {
    const blob = new Blob([content], { type: "image/png" });
    const imageUrl = URL.createObjectURL(blob);
    return (
      <div className="received">
        <img src={imageUrl} alt="chatImage" />
        <div className="timestamp">{time}</div>
      </div>
    );
  } else {
    return (
      <div className="received ">
        <div className="message error-message"> unknown type message❌</div>
        <div className="timestamp">{time}</div>
      </div>
    );
  }
}

export default MainChat;
