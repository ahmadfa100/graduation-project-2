import React from "react";
import { Link } from "react-router-dom"; 
import "../style/SignUp.css";
const styles = {
  marginTop: '25px'
};
function Input(props) {
  return (
    <input
      type={props.type}
      placeholder={props.placeholder}
      required

    />
  );
}

function SignUp() {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", 
    "Jun", "Jul", "Aug", "Sep", "Oct", 
    "Nov", "Dec"
  ];
  const years = Array.from({ length: 2025 - 1950 + 1 }, (_, i) => 1950 + i);

  return (
    <div className="signup-page">
      <div className="signup-cont">
        <form className="signup-form">
          <h2>Create a new account</h2>

          <div className="input-group">
            <label>First name</label>
            <Input type="text" placeholder="First name" />
          </div>

          <div className="input-group">
            <label>LastName</label>
            <Input type="text" placeholder="Last name" />
          </div>

          <div className="input-group">
            <label>Date of birth</label>
            <div className="dob-row">
              <select>
                {days.map(day => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>

              <select>
                {months.map((month, index) => (
                  <option key={month} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>

              <select>
                {years.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label>Gender</label>
            <div className="gender-options">
              <label>
                <input type="radio" name="gender" />Female
              </label>
              <label>
                <input type="radio" name="gender" /> Male
              </label>
            </div>
          </div>

          <div className="input-group">
            <label>Mobile number</label>
            <Input type="number" placeholder="Mobile number" />
            <label style={styles}>email address</label>
            <Input type="email" placeholder="email address" />

          </div>

          <div className="input-group">
            <label>New password</label>
            <Input type="password" placeholder="New password" />
            <label style={styles}>Confirm password</label>
            <Input type="password" placeholder="Confirm password"/>
          </div>

          <button type="submit" className="signup-btn">
            Sign Up
          </button>

          <div className="login-link">
            Already have an account? <Link to="/login">Log In</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
