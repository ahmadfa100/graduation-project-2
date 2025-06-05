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
import UpdateOffer from "./Componenet/updateOffer";
import AccountInf from "./Componenet/AccountInf";
import DashBoard from "./Componenet/DashBoard";
import OfferDetails from "./Componenet/offerDetail";
import FarmerDashboard from "./Componenet/Farmer_Dashboard";
import Policy from "./Componenet/policy";
import Terms from "./Componenet/terms";
import Contact from "./Componenet/contact";
import UserProfile from "./Componenet/UserProfile";

import "./App.css";

function App() {
  return (
    <div className="App">
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
                    <Route path="/homepage" element={<HomePage />} />
                    <Route path="/OfferDetails/:offerID" element={ <NotificationsProvider><OfferDetails /></NotificationsProvider>} />
                    <Route path="/education" element={<Educational />} />
                    <Route path="/article/:id" element={<ArticleDetail />} />
                    <Route
                      path="/AddOffer"
                      element={
                        <NotificationsProvider>
                          <AddOffer />
                        </NotificationsProvider>
                      }
                    />
                    <Route
                      path="/updateOffer/:offerID"
                      element={
                        <NotificationsProvider>
                          <UpdateOffer />
                        </NotificationsProvider>
                      }
                    />
                    <Route path="/about" element={<About />} />
                    <Route path="/policy" element={<Policy />} />
                    <Route path="/terms" element={<Terms />} />
                    
                    <Route path="/contact" element={
                      <NotificationsProvider> <Contact /></NotificationsProvider>
                     } />
                    <Route
                      path="/chat/:paramOfferID?/:paramReceiverID?"
                      element={<Chat/>}
                    />
                    <Route path="/AccountInf" element={<AccountInf />} />
                    <Route
                      path="/DashBoard"
                      element={
                        <NotificationsProvider>
                          <DashBoard />
                        </NotificationsProvider>
                      }
                    />
                    <Route
                      path="/FarmerDashboard"
                      element={
                        <NotificationsProvider>
                          <FarmerDashboard />
                        </NotificationsProvider>
                      }
                    />
                    <Route path="/profile/:userID?" element={<UserProfile />} />
                  </Routes>
                </div>
                <Footer />
              </>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;