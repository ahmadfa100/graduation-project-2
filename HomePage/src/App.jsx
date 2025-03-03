// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import HomePage from "./Componenet/HomePage";
// import Offferdetail from "./Componenet/offerDetail";
// import Educational from "./Componenet/Educational";
// import ArticleDetail from "./Componenet/ArticleDetail";
// // import Chat from "./Componenet/chat";

// import Header from "./layout/Header";
// import Footer from "./layout/Footer";
// import AddOffer from "./Componenet/addOffer";
// import "./App.css";

// function App() {
//   return (
//     <Router>
//       <Header />

//       <Routes>
//         <Route path="/HomePage" element={<HomePage />} />
//         <Route path="/offerDetail" element={<Offferdetail />} />
//         <Route path="/Educational" element={<Educational />} />
//         <Route
//           path="/ArticleDetail/:id"
//           element={<ArticleDetail />}
//         />
//         <Route path="/addOffer" element={<AddOffer />} />
//       </Routes>

//       {/* <div>
//         <Chat
//           chat_title="Distinctive agricultural land in west Irbid for rent"
//           offer_image="./Lands/Map.jpg"
//         ></Chat>
//       </div> */}

//       <Footer />
//     </Router>
//   );
// }

// export default App;


import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Componenet/HomePage";
import Offferdetail from "./Componenet/offerDetail";
import Educational from "./Componenet/Educational";
import ArticleDetail from "./Componenet/ArticleDetail";
import AddOffer from "./Componenet/addOffer";

import Header from "./layout/Header";
import Footer from "./layout/Footer";
import "./App.css";
// import { Link } from "react-router-dom"; // Remove or comment out if unused

function App() {
  return (
    <Router>
      <Header />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/offer" element={<Offferdetail />} />
        <Route path="/education" element={<Educational />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/add-offer" element={<AddOffer />} />
      </Routes>
      
      <Footer />
    </Router>
  );
}

export default App;
