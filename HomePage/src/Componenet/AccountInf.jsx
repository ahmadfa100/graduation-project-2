import React from "react";
import "../style/AccountInf.css";
function AccountInf(){
    return (
        <div className="AccountInf-location">
            
        <div className="AccountInf">
       
        <label>Full Name:</label>
        <input type="text" />
        
        <label>Email:</label>
        <input type="email" />
        
        <label>Mobile Number:</label>
        <input type="text" />
        
        
        
        <label>Gender:</label>
        <input type="text"/>
        
        <label>Date of Birth:</label>
        <input type="text"/>
        
        <label>Password:</label>
        <input type="password"/>
    </div>
    </div>
    );
}
export default AccountInf;