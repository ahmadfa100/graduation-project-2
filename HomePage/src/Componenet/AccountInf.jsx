import React from "react";
import "../style/AccountInf.css";
function AccountInf(){
    return (
<div className="profile-card">
        <img src="./formalpicture.jpg" alt="Profile Picture"/>
        <label>Full Name:</label>
        <input type="text" />
        
        <label>Email:</label>
        <input type="email" />
        
        <label>Mobile Number:</label>
        <input type="text" />
        
        {/* <!-- <label>Profile Link:</label>
        <input type="text" /> --> */}
        
        <label>Gender:</label>
        <input type="text"/>
        
        <label>Date of Birth:</label>
        <input type="text"/>
        
        <label>Password:</label>
        <input type="password"/>
    </div>

    );
}
export default AccountInf;