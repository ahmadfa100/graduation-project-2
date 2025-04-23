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
          <Button onClick={()=>{setCurrentChat(item)}}>
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
           height: "700px", // ✅ Fixed height
           width: 400,
           boxSizing: "border-box",
           position: "relative", // Optional: relative instead of fixed
         },
       }}
       sx={{
         flexShrink: 0,
         "& .MuiDrawer-paper": {
           // You can keep this empty or remove to avoid double styling
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
     <MainChat chatListData={currentChat} />
   </Box>
 </Box>
  );
}
