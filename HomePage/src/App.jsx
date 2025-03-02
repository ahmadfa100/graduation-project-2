import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./HomePage";
import Offferdetail from "./offerDetail";
import Educational from "./Educational";
import ArticleDetail from "./ArticleDetail";

import Header from "./layout/Header";
import Footer from "./layout/Footer";
import AddOffer from "./addOffer";
// <<<<<<< HEAD
import "./App.css";
import { Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Header />
      {/* <Routes>
        <Route path="/" element={<Educational />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
      </Routes> */}
      <Educational/>
      <Footer />
    </Router>
  );
};
// =======
// import Chat from "./chat";
// import"./App.css";


// function App() {
//   return (
//     <div>
     
//     <Chat chat_title="Distinctive agricultural land in west Irbid for rent" offer_image="./Lands/Map.jpg"></Chat>
      
//     </div>
//   )
//   ;
// >>>>>>> 99fb4fc6e41afbc606bdd395546988625b20ef45
// }

export default App;