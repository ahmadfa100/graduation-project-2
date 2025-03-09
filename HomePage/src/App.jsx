// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Componenet/HomePage";
import Offferdetail from "./Componenet/offerDetail";
import Educational from "./Componenet/Educational";
import ArticleDetail from "./Componenet/ArticleDetail";
import About from "./Componenet/about";
import SignUp from "./Componenet/SignUp";
import LogIn from "./Componenet/LogIn";
import Chat from "./Componenet/chat";

import Header from "./layout/Header";
import Footer from "./layout/Footer";
import AddOffer from "./Componenet/addOffer";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route
          path="*"
          element={
            <>
              <Header />
              <div className="content">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/offer" element={<Offferdetail />} />
                  <Route path="/education" element={<Educational />} />
                  <Route path="/article/:id" element={<ArticleDetail />} />
                  <Route path="/AddOffer" element={<AddOffer />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/chat" element={<Chat offer_image="./Lands/Land_1.jpg" />} />
                </Routes>
              </div>
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
