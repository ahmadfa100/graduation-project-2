import React from "react";
import "../style/DashBoard.css";
import { FaTrash, FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNotifications } from "@toolpad/core/useNotifications";
function DashBoard(){
    console.log("inter");
    const notifications = useNotifications();
    async function deleteOffer(){
        try{
            const offerID = 28; // stump
const response = await axios.delete(`http://localhost:3001/deleteOffer/${offerID}`);
            console.log(response.data);


    console.log(response.data.landTitle );
    notifications.show(response.data.message, {
              severity: "success",
              autoHideDuration: 3000,
});
        }catch(err){
            console.error("Error deleting offer:", err);
            notifications.show("Error deleting offer. Please try again.", {
              severity: "error",
              autoHideDuration: 3000,

        });
        
    }}

    return(
<div className="listing-container">
        <div className="header_dash">My Listing View</div>
        <div className="breadcrumb">Listings {'>'} My Listing View</div>
        <div className="listing-card">
            <img src="/content images/my offer.jpg" alt="Farm Image"/>
            <div className="listing-info">
                
                <div className="OfferTime">2025-03-10 04:47</div>
                <h2>Farm Land</h2>
                <p>Farm, Yearly, Northwest</p>
                <p>Lands for Rent in Amman</p>
                <div className="price">JOD 3,000</div>
                <div className="actions">
                    <button>💬 0</button>
                   <Link to="/AddOffer"><button><FaEdit/></button></Link> 
                    <button onClick={deleteOffer} ><FaTrash/></button>
                </div>
            </div>
        </div>
        <div className="listing-card">
            <img src="/content images/my offer.jpg" alt="Farm Image"/>
            <div className="listing-info">
                
                <div className="OfferTime">2025-03-10 04:47</div>
                <h2>Farm Land</h2>
                <p>Farm, Yearly, Northwest</p>
                <p>Lands for Rent in Amman</p>
                <div className="price">JOD 3,000</div>
                <div className="actions">
                    
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