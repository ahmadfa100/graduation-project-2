import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/LogIn.css";
import axios from "axios";

const Login = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); 
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone, password }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Session ID:', data.sessionID);
        navigate('/', { replace: true });
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome back</h2>
      <p>Login to your account</p>
      <form onSubmit={handleLogin} className="login-form">
        <label>
          Enter email or phone
          <input
            type="text"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        
        {error && (
          <div className="error-message" style={{ 
            color: 'red', 
            margin: '10px 0',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        
        <button
          type="submit"
          style={{ 
            backgroundColor: "#45a049", 
            color: "white"
          }}
        >
          Log In
        </button>
      </form>
      <p className="alt-action">
        OR<br />
        Don't have an account?{' '}
        <span 
          className="signup-link" 
          onClick={() => navigate('/signup')}
          style={{ cursor: 'pointer', color: '#45a049' }}
        >
          Create Account
        </span>
      </p>
    </div>
  );
};

export default Login;
