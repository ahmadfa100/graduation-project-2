import React from "react";
import "../style/LogIn.css"
function LogIn(){
    return(
        <div className="login-container">
        <h2>Welcome back</h2>
        <p>Login to your account</p>
        <div class="input-group">
            <input type="text" placeholder="Enter email or phone"/>
        </div>
        <div className="input-group">
            <input type="password" placeholder="Password"/>
        </div>
        <div className="remember-forgot">
            <label><input type="checkbox"/> Remember me</label>
            <a href="#">Forgot Password?</a>
        </div>
        <button className="login-btn">Log In</button>
        <div className="social-login">OR</div>
        {/* <!-- <div class="social-icons">
            <img src="./GoogleLogo.png" alt="Google">
            <img src="./Facebook-Logo.png" alt="Facebook">
        </div> --> */}
        <div className="register">Don't have an account? <a href="./sign up.html">Create Account</a></div>
        </div>
    );
}
export default LogIn ;