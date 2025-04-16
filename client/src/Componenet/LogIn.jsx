import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/LogIn.css";
import axios from "axios";
const Login = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        credentials: 'include',              // include session cookie
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone, password }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Session ID:', data.sessionID);
        navigate('/dashboard');
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Login error:', error);
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
        <button type="submit">Log In</button>
      </form>
      <p className="alt-action">
        OR<br />
        Don’t have an account?{' '}
        <span className="signup-link" onClick={() => navigate('/signup')}>
          Create Account
        </span>
      </p>
    </div>
  );
};

export default Login;