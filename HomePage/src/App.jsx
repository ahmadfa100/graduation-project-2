import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Componenet/HomePage";
import Offferdetail from "./Componenet/offerDetail";
import Educational from "./Componenet/Educational";
import ArticleDetail from "./Componenet/ArticleDetail";
// import Chat from "./Componenet/chat";

import Header from "./layout/Header";
import Footer from "./layout/Footer";
import AddOffer from "./Componenet/addOffer";
import "./App.css";
import AccountInf from "./Componenet/AccountInf";
import About  from "./Componenet/about";
import LogIn from "./Componenet/LogIn";
import SignUp from "./Componenet/SignUp";
function App() {
  return (

<div>
 <Header/>
<LogIn/>
 <Footer/>
</div>
  );
}

 export default App;


      
   /* <div>
        <Chat
          chat_title="Distinctive agricultural land in west Irbid for rent"
          offer_image="./Lands/Map.jpg"
        ></Chat>
      </div> */   


/* <Offferdetail title="green flat land in irbid" price="2000" RentalType="monthly"  size="2" location="irbid"
description="Discover this expansive and serene green 
flat land located in the heart of Irbid, perfect for agricultural 
projects, recreational spaces, or future development. Spanning 2 dunums, this property offers
 ample space to bring your vision to life. Available for rent on a monthly basis, this land provides 
 flexibility and convenience for your needs. Whether you're looking to cultivate crops, create a
  community garden, or start a new construction project, this prime location in Irbid is ideal. Don’t miss out
   on this fantastic opportunity to secure a versatile piece of land in a thriving area. Contact us today to arrange 
   a viewing and explore the potential of this beautiful property!"


></Offferdetail> */