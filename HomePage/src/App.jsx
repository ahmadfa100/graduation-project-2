import React from "react";
import HomePage from "./HomePage";
import Offferdetail from "./offerDetail";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import AddOffer from "./addOffer";
import Chat from "./chat";
import"./App.css";


function App() {
  return (
    <div>
     
    <Chat chat_title="Distinctive agricultural land in west Irbid for rent" offer_image="./Lands/Map.jpg"></Chat>
      
    </div>
  )
  ;
}
//<Offferdetail pictures={images} location="Irbid" size="2" RentalType="annul"  title="Distinctive agricultural land in west Irbid for rent" price="2000" description="This fertile agricultural land in west Irbid is an ideal choice for farming enthusiasts and professionals alike. Spanning over 2 dunums, the land features nutrient-rich soil perfect for growing a variety of crops, from vegetables to fruit trees. Its strategic location offers easy access to water resources and is well-connected to nearby markets and towns. The surrounding landscape ensures a peaceful environment, with ample sunlight and favorable weather conditions year-round. Whether you're looking to expand your agricultural business or start a new venture, this land provides excellent potential for high yields and sustainable farming."/>

export default App;
