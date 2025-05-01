import "./buttons.css";
import { useState } from "react";
import { 
  FaPhoneAlt, 
  FaComments, 
  FaHeart, 
  FaRegHeart, 
  FaPaperPlane, 
  FaUpload 
} from "react-icons/fa";
import { GiWheat } from "react-icons/gi";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

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


function Like({ isLiked, onClick }) {
  return (
    <button onClick={onClick} className="custom-button">
      {isLiked ? <FaHeart /> : <FaRegHeart />}
    </button>
  );
}
function Rent({onClick}) {
  
  const [open, setOpen] = useState(false);
 
  const handleClose = (confirmed) => {
    setOpen(false);
    if (confirmed) {
      onClick();
      

    }
  };

  return (
    <div >
      <button className="custom-button Rent-button" onClick={()=>{ setOpen(true)}}>
        <GiWheat style={{ marginRight: "8px" }} />
        Rent Land
      </button>

      <Dialog open={open} onClose={() => handleClose(false)}>
        <DialogTitle>Confirm Rent Request</DialogTitle>
        <DialogContent>
          Are you sure you want to rent this land?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)} color="error">Cancel</Button>
          <Button onClick={() => handleClose(true)} color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
function ChatInput({ message, setMessage, preview, setPreview, sendMessage }) {
  return (
    <div className="chat-input">
 
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
        name="chat_input_no_autofill"
        type="text"
        placeholder="Type a message..."
        autoComplete="off"
        value={message||" "}
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
export { Call, Chat, Like,Rent,ChatInput };
