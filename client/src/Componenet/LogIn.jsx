import React from "react";
import "../style/LogIn.css";
import { Link } from "react-router-dom";
function Input(props) {
  return (
    <input
      type={props.type}
      placeholder={props.placeholder}
      required

    />
  );
}
function LogIn() {
  return (    
    

    <div className="login-location">
    <div className="login-container">
      <h2>Welcome back</h2>
      <p>Login to your account</p>
      <div class="input-group">
        <Input type="text" placeholder="Enter email or phone" />
      </div>
      <div className="input-group">
        <Input type="password" placeholder="Password" />
      </div>
      <div className="remember-forgot">
        <label>
          <input type="checkbox" /> Remember me
        </label>
        <a href="#">Forgot Password?</a>
      </div>
      <button className="login-btn">Log In</button>
      <div className="social-login">OR</div>
      {/* <!-- <div class="social-icons">
            <img src="./GoogleLogo.png" alt="Google">
            <img src="./Facebook-Logo.png" alt="Facebook">
        </div> --> */}
      <div className="register">
        Don't have an account? <Link to="/signup">Create Account</Link>
      </div>
    </div></div>
    
  );
}
export default LogIn;
