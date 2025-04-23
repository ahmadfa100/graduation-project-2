import { useState, useEffect } from "react";
import "../style/chat.css";
import { FaCamera, FaPaperPlane, FaUpload } from "react-icons/fa";
import { Link,useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

const socket = io("http://localhost:3001", { autoConnect: false });

function MainChat( props) {
  ////
console.log("from main : ",props.chatListData)
  ///
  const [message, setMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [offer, setOffer] = useState(null);
  const [offerOwner, setOfferOwner] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isChatLoding, setChatLoading] = useState(true);
  const [isOfferLoding, setOfferLoding] = useState(true);
  const [isUserLoading,setUserLoading]= useState(true);
  const [sessiondata, setSessiondata] = useState(null); 
  const [sessionReady, setSessionReady] = useState(false);
  const [offerID,setOfferID]= useState(null);
  const [ReceiverID,setReceiverID] =useState(null);
  const { paramReceiverID, paramOfferID } = useParams();
  const [chatID,setChatID]=useState(null);
  const [room,setRoom]= useState(null);

  useEffect(() => {
    const getChatID = async () => {
      if (offerID && ReceiverID) {
        const id = await fetchChatID(offerID, ReceiverID);
        setChatID(id); 
      }
    };
    getChatID();
  }, [offerID, ReceiverID]);
  


  useEffect(() => {
    setRoom(chatID);
    console.log("chat id useeffect :",chatID);
  }, [chatID]);
useEffect(()=>{
console.log("room: ",room);
},[room]);
  const fetchChatID = async (offerID, userID) => {
    try {
      const response = await axios.get('http://localhost:3001/getchatID', {
        params: { offerID, userID },
      });
  
      console.log('Chat ID is:', response.data.chatID);
      return response.data.chatID;
    } catch (error) {
      if (error.response) {
        console.log("sad");
        console.error('Error response:', error.response.data);
      } else {
        console.error('Request error:', error.message);
      }
      return null;
    }
  };



  useEffect(() => {
    if (props.chatListData && props.chatListData.offerID) {
      setOfferID(props.chatListData.offerID);
      setReceiverID(props.chatListData.otherParticipantID);
      console.log("from props");
    } else {
      // fallback to URL params if available
      setOfferID(paramOfferID);
      setReceiverID(paramReceiverID);
      console.log("from params");
    }
  }, [props.chatListData, paramOfferID, paramReceiverID]);

//
useEffect(() => {
  setMessages([]);
}, [offerID, ReceiverID]);

useEffect(() => {
  console.log("Offer ID:", offerID);
  console.log("Owner ID:", ReceiverID);
}, [offerID, ReceiverID]);
useEffect(()=>{
  
fetchSession();
},[]);
  useEffect(() => {
    console.log("enter");
    if (!sessionReady || sessiondata === null) return;
    console.log("vaild");
    setMessages([]);
    setMessage(null);
    fetchOffer(offerID);

    socket.emit("Initialize", {
      sender: sessiondata.userID 
,
      receiver: ReceiverID,
      offer: offerID,
    }); //The receiver takes owner ID not work with all scenarios owner id will be taken from offer only if user click on the chat button
    socket.on("InitialMessages", (id) => {
      console.log("chat  client id:", id);
      fetchChat(id);
    });

    socket.connect();
    socket.emit("join", room);

    socket.on("RecivedMessage", (newMessage) => {
      console.log("Received message:", newMessage);

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
  }, [sessionReady, sessiondata, room]);

  async function fetchSession() {
    try {
      const sessionResponse = await axios.get(`http://localhost:3001/sessionInfo`, {
        withCredentials: true, 
      });
      const user = sessionResponse.data.user;

      if (user ) {
        
      setSessiondata({
        userID:sessionResponse.data.user.id
      });  
        setSessionReady(true);  
        console.log("Session data:", user);
      } else {
        console.warn("No user found in session.");
      }
     
    } catch (err) {
      console.error("Failed to fetch session info:", err);
    }
  }
  async function fetchChat(chatID) {
    try {
      console.log("Fetching chat messages...");
      const response = await axios.get(
        `http://localhost:3001/getchatcontent/`,
        { params: { chatID } }
      );

      console.log("respones :", response.data );
      if (response.data.error) {
        //  console.log("Error fetching chat messages:", response.data.error);
        return;
      }
      if (response.data === "Not Found") {
        console.log("No chat messages available.");
        setChatLoading(false);
      } else {
        const oldMessages = response.data;
        //  console.log(Array.isArray(oldMessages)); // Should print true
        //   console.log("messages:",oldMessages);
        oldMessages.forEach((element) => {
          if (element.senderid === sessiondata.userID 
) {
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
      setChatLoading(false);
      console.error("Error fetching chat:", error);
    }
  }

  async function fetchOffer(offerID) {
    try {
      const response = await axios.get(
        `http://localhost:3001/getOffer/${offerID}`
      );
      //console.log("herrrrrr",);
      if (response.data.error) {
        console.log("Error fetching offer:", response.data.error);
        return;
      }
      if (response.data) {
        setOffer(response.data);
        setOfferLoding(false);
        console.log("Offer received:", response.data);
      }
      // owner

      fetchOfferOwner(response.data.offer.ownerid);
    } catch (error) {
      console.error("Error fetching offer:", error);
    }
  }
  async function fetchOfferOwner(ReceiverID) {
    try {
      const response = await axios.get(`http://localhost:3001/getUser/`, {
        params: { userID: ReceiverID },
      });
console.log("here now :",response.data)
      if (response.data.error) {
        console.log("Error fetching owner:", response.data.error);
        return;
      }
      if (response.data) {
        setOfferOwner(response.data);
        setUserLoading(false);
        // console.log("owner k",offerOwner.firstname);
      }
    } catch (error) {
      console.error("Error fetching owner:", error);
    }
  }

  const sendMessage = () => {
    document
      .querySelectorAll("input")
      .forEach((element) => (element.value = ""));

    if (message == null) {
      return;
    }

    const messageData = { message, room, sender: sessiondata.userID 
 }; // gpt: Include sender ID
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
      {isChatLoding || isOfferLoding ||isUserLoading  ? (
        <ClipLoader color="green" size={50} />
      ) : (
        <div className="chat-container">
          <div className="chat-header">
            <div className="chat-offer-header">
              <Link to="/offer">
                <img
                  src={offer.images[0] ? offer.images[0] : ""}
                  alt="LandImage"
                />
              </Link>
              <h3>{offer.offer.landtitle || ""}</h3>
            </div>
            <div className="chat-owner">
              {" "}
              <h4>
                {offerOwner.firstname || " "} {offerOwner.lastname || " "}
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
  //console.log("image type: " , typeof content, "the actual content:\n", content);//line 2

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
