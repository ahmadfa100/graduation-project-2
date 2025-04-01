import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import "../style/SignUp.css";
import axios from "axios";

const styles = {
  marginTop: '25px'
};

function Input(props) {
  return (
    <input
      type={props.type}
      placeholder={props.placeholder}
      name={props.name}
      value={props.value}
      onChange={props.onChange}
      required
    />
  );
}

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    day: '1',
    month: 'Jan',
    year: '1950',
    gender: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", 
    "Jun", "Jul", "Aug", "Sep", "Oct", 
    "Nov", "Dec"
  ];
  const years = Array.from({ length: 2025 - 1950 + 1 }, (_, i) => 1950 + i);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/api/signup', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        day: formData.day,
        month: months.indexOf(formData.month) + 1,
        year: formData.year,
        gender: formData.gender,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      if (response.data.message === 'User created successfully') {
        navigate('/login'); // Redirect to login page after successful signup
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-cont">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2>Create a new account</h2>
          
         

          <div className="input-group">
            <label>First name</label>
            <Input 
              type="text" 
              placeholder="First name" 
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Last name</label>
            <Input 
              type="text" 
              placeholder="Last name" 
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Address</label>
            <Input 
              type="text" 
              placeholder="Address" 
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Date of birth</label>
            <div className="dob-row">
              <select name="day" value={formData.day} onChange={handleChange}>
                {days.map(day => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>

              <select name="month" value={formData.month} onChange={handleChange}>
                {months.map(month => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>

              <select name="year" value={formData.year} onChange={handleChange}>
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
                <input 
                  type="radio" 
                  name="gender" 
                  value="female" 
                  checked={formData.gender === 'female'}
                  onChange={handleChange}
                required/> Female
              </label>
              <label>
                <input 
                  type="radio" 
                  name="gender" 
                  value="male" 
                  checked={formData.gender === 'male'}
                  onChange={handleChange}
                required/> Male
              </label>
            </div>
          </div>

          <div className="input-group">
            <label>Mobile number</label>
            <Input 
              type="number" 
              placeholder="Mobile number" 
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
            />
            <label style={styles}>Email address</label>
            <Input 
              type="email" 
              placeholder="Email address" 
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>New password</label>
            <Input 
              type="password" 
              placeholder="New password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <label style={styles}>Confirm password</label>
            <Input 
              type="password" 
              placeholder="Confirm password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
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





// import React from "react";
// import { Link } from "react-router-dom"; 
// import "../style/SignUp.css";
// const styles = {
//   marginTop: '25px'
// };
// function Input(props) {
//   return (
//     <input
//       type={props.type}
//       placeholder={props.placeholder}
//       required

//     />
//   );
// }

// function SignUp() {
//   const days = Array.from({ length: 31 }, (_, i) => i + 1);
//   const months = [
//     "Jan", "Feb", "Mar", "Apr", "May", 
//     "Jun", "Jul", "Aug", "Sep", "Oct", 
//     "Nov", "Dec"
//   ];
//   const years = Array.from({ length: 2025 - 1950 + 1 }, (_, i) => 1950 + i);

//   return (
//     <div className="signup-page">
//       <div className="signup-cont">
//         <form className="signup-form">
//           <h2>Create a new account</h2>

//           <div className="input-group">
//             <label>First name</label>
//             <Input type="text" placeholder="First name" />
//           </div>

//           <div className="input-group">
//             <label>LastName</label>
//             <Input type="text" placeholder="Last name" />
//           </div>

//           <div className="input-group">
//             <label>Date of birth</label>
//             <div className="dob-row">
//               <select>
//                 {days.map(day => (
//                   <option key={day} value={day}>
//                     {day}
//                   </option>
//                 ))}
//               </select>

//               <select>
//                 {months.map((month, index) => (
//                   <option key={month} value={index + 1}>
//                     {month}
//                   </option>
//                 ))}
//               </select>

//               <select>
//                 {years.map(year => (
//                   <option key={year} value={year}>
//                     {year}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="input-group">
//             <label>Gender</label>
//             <div className="gender-options">
//               <label>
//                 <input type="radio" name="gender" />Female
//               </label>
//               <label>
//                 <input type="radio" name="gender" /> Male
//               </label>
//             </div>
//           </div>

//           <div className="input-group">
//             <label>Mobile number</label>
//             <Input type="number" placeholder="Mobile number" />
//             <label style={styles}>email address</label>
//             <Input type="email" placeholder="email address" />

//           </div>

//           <div className="input-group">
//             <label>New password</label>
//             <Input type="password" placeholder="New password" />
//             <label style={styles}>Confirm password</label>
//             <Input type="password" placeholder="Confirm password"/>
//           </div>

//           <button type="submit" className="signup-btn">
//             Sign Up
//           </button>

//           <div className="login-link">
//             Already have an account? <Link to="/login">Log In</Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default SignUp;
