import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./HomePage";
import Offferdetail from "./offerDetail";
import Educational from "./Educational";
import ArticleDetail from "./ArticleDetail";

import Header from "./layout/Header";
import Footer from "./layout/Footer";
import AddOffer from "./addOffer";
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
}

export default App;
