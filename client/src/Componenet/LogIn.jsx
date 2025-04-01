import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/LogIn.css";
import axios from "axios";

function Input({ type, placeholder, name, value, onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      required
    />
  );
}

function LogIn() {
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/api/login', {
        emailOrPhone: formData.emailOrPhone,
        password: formData.password
      });

      if (response.data.message === 'Login successful') {
        // Store user data in localStorage or context/state management
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard'); // Redirect to dashboard or home page
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (    
    <div className="login-location">
      <div className="login-container">
        <h2>Welcome back</h2>
        <p>Login to your account</p>
        
        
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <Input 
              type="text" 
              placeholder="Enter email or phone" 
              name="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <Input 
              type="password" 
              placeholder="Password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <div className="social-login">OR</div>
        <div className="register">
          Don't have an account? <Link to="/signup">Create Account</Link>
        </div>
      </div>
    </div>
  );
}

export default LogIn;


// import React from "react";
// import "../style/LogIn.css";
// import { Link } from "react-router-dom";
// function Input(props) {
//   return (
//     <input
//       type={props.type}
//       placeholder={props.placeholder}
//       required

//     />
//   );
// }
// function LogIn() {
//   return (    
    

//     <div className="login-location">
//     <div className="login-container">
//       <h2>Welcome back</h2>
//       <p>Login to your account</p>
//       <div class="input-group">
//         <Input type="text" placeholder="Enter email or phone" />
//       </div>
//       <div className="input-group">
//         <Input type="password" placeholder="Password" />
//       </div>
//       <div className="remember-forgot">
//         <label>
//           <input type="checkbox" /> Remember me
//         </label>
//         <a href="#">Forgot Password?</a>
//       </div>
//       <button className="login-btn">Log In</button>
//       <div className="social-login">OR</div>
//       {/* <!-- <div class="social-icons">
//             <img src="./GoogleLogo.png" alt="Google">
//             <img src="./Facebook-Logo.png" alt="Facebook">
//         </div> --> */}
//       <div className="register">
//         Don't have an account? <Link to="/signup">Create Account</Link>
//       </div>
//     </div></div>
    
//   );
// }
// export default LogIn;
