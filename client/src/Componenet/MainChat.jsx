import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import { ChatInput } from "../layout/buttons";
import { Send, Receive } from "./chatComponent";
import "../style/chat.css";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";

const socket = io(process.env.REACT_APP_SERVER_URL, { autoConnect: false });

function MainChat(props) {
  const [message, setMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [preview, setPreview] = useState(null);
  const [isChatLoding, setChatLoading] = useState(true);
  const [offerID, setOfferID] = useState(null);
  const [ReceiverID, setReceiverID] = useState(null);
  const { paramReceiverID, paramOfferID } = useParams();
  const [chatData, setChatData] = useState({});
  const [room, setRoom] = useState(null);
  const [isChatDataLoading, setIsChatDataLoading] = useState(true);
  const chatDataRef = useRef(chatData);
  const roomRef = useRef(room);
  const navigate = useNavigate();
  useEffect(() => {
    chatDataRef.current = chatData;
  }, [chatData]);
  
  useEffect(() => {
    roomRef.current = room;
  }, [room]);
  
  useEffect(() => {
    if (props.chatListData.offerID&&props.chatListData.otherParticipantID) {
      setOfferID(props.chatListData.offerID);
      setReceiverID(props.chatListData.otherParticipantID);
      console.log("by props");
    } else if(paramReceiverID&&paramOfferID) {
      console.log("by params");
      setOfferID(paramOfferID);
      setReceiverID(paramReceiverID);
    }
    setChatLoading(true);
    setIsChatDataLoading(true);
  }, [ paramOfferID, paramReceiverID, props.chatListData.offerID,props.chatListData.otherParticipantID]);
  
  useEffect(() => {
    console.log("offerID, ReceiverID", offerID, ReceiverID);
    if(offerID&&ReceiverID){
      setMessages([]);
    fetchChatData(offerID, ReceiverID);
  }
  }, [offerID, ReceiverID]);

  useEffect(() => {
    setRoom(chatData.chatid);
    console.log("chatData ", chatData);
  }, [chatData]);

  useEffect(() => {
    setMessages([]);
    setMessage([]);
  }, [offerID, ReceiverID,props]);

  useEffect(() => {
    socket.connect();
    socket.off("InitialMessages");
    socket.on("InitialMessages", (id) => {
      fetchChat(id);
    });
  
    socket.off("RecivedMessage");
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
      socket.off("InitialMessages");
      socket.off("RecivedMessage");
      socket.disconnect();
    };
  }, []); 
  
  useEffect(() => {
    if (!room || !chatData.currentUserID || !chatData.participantid) return;
  
    setMessages([]);
    setMessage(null);
  
    socket.emit("Initialize", {
      sender: chatData.currentUserID,
      receiver: chatData.participantid,
      offer: offerID,
    });
  
    socket.emit("join", room);
  }, [room, offerID, chatData]);
  

  const fetchChatData = async (offerID, userID) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/getChatData`, {
        params: { offerID, userID },
        withCredentials: true,
      });

      console.log("ChatID data:", response.data);

      setChatData(response.data);
      setIsChatDataLoading(false);
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
      } else {
        console.error("Request error:", error.message);
      }
      return null;
    }
  };

  async function fetchChat(chatID) {
    try {

      // console.log("Fetching chat messages...");
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/getchatcontent/`,
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
        const formattedMessages = oldMessages.map((element) => {
  const isCurrentUser = element.senderid === chatDataRef.current.currentUserID;
  const sender = isCurrentUser ? "sent" : "received";
  const content = element.contenttext
    ? element.contenttext
    : new Uint8Array(element.contentfile?.data || []);
    const date = new Date(element.sent_at);
    date.setHours(date.getHours() + 3); // Add 3 hours
    
    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return {
    content,
    sender,
    time: time
  };
});

setMessages(formattedMessages); 

        console.log(messages);
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

    const messageData = { message, room, sender: chatData.currentUserID}; 
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
      {isChatDataLoading &&isChatLoding ? (
        <ClipLoader color="green" size={50} />
      ) : (
        <div className="chat-container">
          <div className="chat-header">
            <div className="chat-offer-header">
                {chatData.offerImage && (
                  <div className="chat-clickable" onClick={()=>{chatData.offerid && navigate(`/OfferDetails/${chatData.offerid}`)}}>
                  <img
                    src={`data:image/jpeg;base64,${chatData.offerImage}`}
                    alt="land"
                  />
                  </div>
                )}
             <div className="chat-clickable" onClick={()=>{chatData.offerid && navigate(`/OfferDetails/${chatData.offerid}`)}}>
             <h3>{chatData.landtitle || ""}</h3>
             </div>
            </div>
            <div className="chat-owner">
              {" "}
              <h4 onClick={()=>{navigate(`/profile/${chatData.participantid}`)}}>
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

export default MainChat;