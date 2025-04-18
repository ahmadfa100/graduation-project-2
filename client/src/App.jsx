// App.jsx
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
import "./App.css";
import AccountInf from "./Componenet/AccountInf";
import DashBoard from "./Componenet/DashBoard";
import OfferDetails from "./Componenet/offerDetail";

function App() {
  return (
    <div className="App">   {/* <-- Use your .App CSS here */}
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
                    <Route
                      path="/OfferDetails/:offerID"
                      element={<OfferDetails />}
                    />
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
                      path="/updateOffer"
                      element={
                        <NotificationsProvider>
                          <UpdateOffer />
                        </NotificationsProvider>
                      }
                    />
                    <Route path="/about" element={<About />} />
                    <Route
                      path="/chat/:offerID/:ReceiverID"
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
                      path="/OfferDetails"
                      element={
                        <div className="p-10">
                          <OfferDetails />
                        </div>
                      }
                    />
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
