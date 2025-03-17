// App.jsx
//3/14
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NotificationsProvider } from "@toolpad/core/useNotifications";
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
import AccountInf from "./Componenet/AccountInf";
import DashBoard from "./Componenet/DashBoard";
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
                
                  <Route path="/AddOffer" element={  <NotificationsProvider><AddOffer /></NotificationsProvider>} />
              
                  <Route path="/about" element={<About />} />
                  <Route path="/chat" element={<Chat offer_image="./Lands/Land_1.jpg" />} />
                  <Route path="/AccountInf" element={<AccountInf/>}/>
                  <Route path="/DashBoard" element={<DashBoard/>}/>
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
