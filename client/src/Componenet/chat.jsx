import MainChat from "./MainChat";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";


export default function Chat() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [chatsList,setChatList]=useState([]);
  const [currentChat,setCurrentChat]=useState({});
  const [isChatListReady,setIsChatListReady]=useState(true);
  const { paramReceiverID, paramOfferID } = useParams();
  const [isChatSelected,setisChatSelected]=useState(true);
  
  useEffect(() => {
    if (paramOfferID && paramReceiverID) {
      console.log("Params exist");
      setisChatSelected(false);
    }
  }, [paramOfferID, paramReceiverID]);
  
useEffect(()=>{
fetchChatsList()


},[]);

async function fetchChatsList() {
 try{
  const chats= await axios.get("http://localhost:3001/getChatByUser/",{withCredentials:true});
  setChatList(chats.data);
  //console.log("chatList att: ",chats.data);
  setIsChatListReady(false)
 }catch(err){
  if (err.response && err.response.status === 401) {
    console.log("Not authenticated! Redirecting to login...");
    window.location.href = '/login';
    return; 
  }
  console.log("Error while fetch chatlists",err);
 }
}



const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <List>
        {chatsList.map((item,index) => (
           <React.Fragment key={item._id || index}>
          <Button onClick={()=>{setCurrentChat(item);setisChatSelected(false)}}>
          <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: 2,
        borderRadius: 2,
        width:"370px",
        maxWidth: 500,
      }}
    >
      <img
        src={item.offerPicture}
        alt="offer img"
        style={{
          width: '50px',
          height: '50px',
          objectFit: 'cover',
          borderRadius: '50%',
          marginRight: '16px',
        }}
      />
      <Box>
        <Typography sx={{ textTransform: 'none' }} fontWeight="700" color="black">

          {item.offerTitle}
        </Typography> 
        <Typography variant="body2" color="gray"sx={{ textTransform: 'none' }}>
       
        {item.otherParticipantName}
        </Typography>
      </Box>
    </Box>
          </Button>
            <Divider />
            </React.Fragment>
        ))}
      </List>
    </div>
  );
  const Initialchat = () => {
    return (
      <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        textAlign: 'center',
  
        p: 20,
        m:0
      }}
      >
       <Typography sx={{ textTransform: 'none' }} fontWeight="700" color="gray">
       Select a chat to start chatting
       </Typography>
      </Box>
    );
  };
  

  return (
   isChatListReady? 
   <Box sx={{display:"flex", justifyContent:"center",marginTop:"150px" }}> <ClipLoader color="green" size={50} /></Box>:
   <Box sx={{ display: "flex" }}>
   <CssBaseline />
   <Box sx={{ height: "100px" }}>
     <Drawer
       variant={isMobile ? "temporary" : "permanent"}
       open={isMobile ? mobileOpen : true}
       onClose={handleDrawerToggle}
       ModalProps={{ keepMounted: true }}
       PaperProps={{
         sx: {
           margin: "20px",
           borderRadius: "15px",
           height: "700px", 
           width: "100%",
           boxSizing: "border-box",
           position: "relative", 
         },
       }}
       
     >
       <Box
         sx={{
           height: 64,
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           px: 2,
           backgroundColor: "rgb(76, 175, 80)",
           color: "white",
           fontWeight: "bold",
           fontSize: "1.2rem",
         }}
       >
         My Chats
       </Box>
       {drawer}
     </Drawer>
   </Box>

   {/* Main Content */}
   <Box
     component="main"
     sx={{
       flexGrow: 1,
       p: 3,
       width: { sm: `calc(100% - ${400}px)` },
       height: "800px ",
     }}
   >
     <Toolbar />
    {isChatSelected?
    <Initialchat/>
    :
     <MainChat chatListData={currentChat} />
    }
   </Box>
 </Box>
  );
}

