import React from "react";
import "../style/DashBoard.css";
import { FaTrash, FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
function DashBoard(){
    return(
<div class="listing-container">
        <div class="header">My Listing View</div>
        <div class="breadcrumb">Listings {'>'} My Listing View</div>
        <div class="listing-card">
            <img src="/content images/my offer.jpg" alt="Farm Image"/>
            <div class="listing-info">
                
                <div class="OfferTime">2025-03-10 04:47</div>
                <h2>Farm Land</h2>
                <p>Farm, Yearly, Northwest</p>
                <p>Lands for Rent in Amman</p>
                <div class="price">JOD 3,000</div>
                <div class="actions">
                    <button>💬 0</button>
                   <Link to="/AddOffer"><button><FaEdit/></button></Link> 
                    <button><FaTrash/></button>
                </div>
            </div>
        </div>
        <div class="listing-card">
            <img src="/content images/my offer.jpg" alt="Farm Image"/>
            <div class="listing-info">
                
                <div class="OfferTime">2025-03-10 04:47</div>
                <h2>Farm Land</h2>
                <p>Farm, Yearly, Northwest</p>
                <p>Lands for Rent in Amman</p>
                <div class="price">JOD 3,000</div>
                <div class="actions">
                    
                    <button>💬 0</button>
                    <Link to="/AddOffer"><button><FaEdit/></button></Link> 
                    <button><FaTrash/></button>
                </div>
            </div>
        </div>
      
    </div>



    );
};
export default DashBoard;