<<<<<<< HEAD
=======
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

>>>>>>> 4e73dd7d398b29e108410e3a6a8fcc896ac00300
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

function App() {
  return (
    <Router>
      <Header />
<<<<<<< HEAD
      <AddOffer />
      <Footer />
    </Router>
  );
}

export default App;

/*
=======

>>>>>>> 4e73dd7d398b29e108410e3a6a8fcc896ac00300
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/offer" element={<Offferdetail />} />
        <Route path="/education" element={<Educational />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/AddOffer" element={<AddOffer />} />
      </Routes>
<<<<<<< HEAD
      
      
*/
=======

      <Footer />
    </Router>
  );
}
>>>>>>> 4e73dd7d398b29e108410e3a6a8fcc896ac00300


{/* <Offferdetail title="green flat land in irbid" price="2000" RentalType="monthly"  size="2" location="irbid"
description="Discover this expansive and serene green 
flat land located in the heart of Irbid, perfect for agricultural 
projects, recreational spaces, or future development. Spanning 2 dunums, this property offers
 ample space to bring your vision to life. Available for rent on a monthly basis, this land provides 
 flexibility and convenience for your needs. Whether you're looking to cultivate crops, create a
  community garden, or start a new construction project, this prime location in Irbid is ideal. Don’t miss out
   on this fantastic opportunity to secure a versatile piece of land in a thriving area. Contact us today to arrange 
   a viewing and explore the potential of this beautiful property!"


></Offferdetail> */}