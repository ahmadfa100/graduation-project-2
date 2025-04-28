import "./buttons.css";
import { useState } from "react";
import { FaPhoneAlt, FaComments  ,FaHeart, FaRegHeart } from "react-icons/fa";
import { GiWheat } from "react-icons/gi";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

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
export { Call, Chat, Like,Rent };
