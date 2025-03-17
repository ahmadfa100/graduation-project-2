import React from "react";
import "../style/AccountInf.css";

function AccountInf(){
    return (
        
        <div className="AccountInf-location">
        

        <div className="AccountInf">

        <img src="content images/formalpicture.jpg"/>
        
        <label>Full Name:</label>
        <input type="text" placeholder="Zaid Hassouneh"/>
        
        <label>Email:</label>
        <input type="email" placeholder="zaidhassouneh256@gmail.com"/>
        
        <label>Mobile Number:</label>
        <input type="text" placeholder="0799957608" />
        
        
        
        <label>Gender:</label>
        <input type="text" placeholder="male"/>
        
        <label>Date of Birth:</label>
        <input type="text" placeholder="25/6/2003"/>
        
        <label>Password:</label>
        <input type="password" placeholder=""/>
        <button type="submit" className="Submit-btn ">submit</button>
    </div>
    
    </div>);
}
export default AccountInf;