import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../style/AccountInf.css";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function validateName(name) {
  if (!/^[a-zA-Z\s]{2,30}$/.test(name)) {
    return "2–30 letters and spaces only";
  }
  return "";
}

function validateEmail(email) {
  if (!email) return "Please fill out this field";
  if (/\s/.test(email)) return "Email cannot contain spaces";
  if (!email.includes("@")) return "Must contain @ symbol";
  const [local, domain] = email.split("@");
  if (!local) return "Missing text before @";
  if (!domain) return "Missing domain after @";
  if (!domain.includes(".")) return "Domain must contain .";
  if (domain.endsWith(".")) return "Domain cannot end with .";
  const parts = domain.split(".");
  if (parts[parts.length - 1].length < 2) return "Domain extension too short";
  return "";
}

function validatePhone(phone) {
  if (!/^\d{10}$/.test(phone)) {
    return "Must be exactly 10 digits";
  }
  return "";
}

function validateAddress(addr) {
  if (addr.trim().length < 5) {
    return "At least 5 characters";
  }
  return "";
}

function validateAge(age) {
  const n = parseInt(age, 10);
  if (isNaN(n) || n < 13) {
    return "Must be a number ≥ 13";
  }
  return "";
}

function validatePassword(pw) {
  const checks = [];
  if (pw.length < 8) checks.push("at least 8 chars");
  if (!/[A-Z]/.test(pw)) checks.push("one uppercase letter");
  if (!/[0-9]/.test(pw)) checks.push("one number");
  if (!/[!@#$%^&*(),.?\":{}|<>\-_=+\[\]\\/;'`~]/.test(pw))
    checks.push("one symbol");
  return checks.length ? `Needs ${checks.join(", ")}` : "";
}

export default function AccountInf() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    gender: "",
    address: "",
    age: "",
    password: "",
  });
  const [isEditing, setIsEditing] = useState({
    fullName: false,
    email: false,
    mobileNumber: false,
    gender: false,
    address: false,
    age: false,
    password: false,
  });
  const [errors, setErrors] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    // Check session before fetching data
    axios.get(`${process.env.REACT_APP_SERVER_URL}/api/check-session`, { withCredentials: true })
      .then(() => {
        // Session is valid, fetch user data
        axios.post(`${process.env.REACT_APP_SERVER_URL}/api/account`, {}, { withCredentials: true })
          .then((res) => {
            const d = res.data;
            setUserData({
              fullName: d.fullName,
              email: d.email,
              mobileNumber: d.mobileNumber,
              gender: d.gender,
              address: d.address,
              age: d.age,
              password: "",
            });
            setProfileImage(d.profileImage || null);
          })
          .catch((err) => {
            console.error(err);
            navigate("/login");
          });
      })
      .catch(() => {
        navigate("/login");
      });
  }, [navigate]);

  const validators = {
    fullName: validateName,
    email: validateEmail,
    mobileNumber: validatePhone,
    gender: (g) => (g ? "" : "Please select gender"),
    address: validateAddress,
    age: validateAge,
    password: validatePassword,
  };

  const toggleEdit = (field) => {
    if (isEditing[field]) {
      const err = validators[field](userData[field]);
      if (err) {
        setErrors((e) => ({ ...e, [field]: err }));
        return;
      }
      setErrors((e) => ({ ...e, [field]: "" }));

      axios
        .post(
          `${process.env.REACT_APP_SERVER_URL}/api/account/update`,
          { [field]: userData[field] },
          { withCredentials: true }
        )
        .then(() => console.log(`${field} updated`))
        .catch((e) => {
          console.error(e);
          if (e.response?.status === 401) {
            navigate("/login");
          } else {
            setErrors((errState) => ({
              ...errState,
              [field]: e.response?.data?.error || "Update failed",
            }));
          }
        });
    }
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field, val) => {
    setUserData((u) => ({ ...u, [field]: val }));
    if (errors[field]) {
      setErrors((e) => ({ ...e, [field]: "" }));
    }
  };

  const handleUpload = () => fileInputRef.current.click();
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(reader.result);
      axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/account/upload-image`,
        { image: reader.result },
        { withCredentials: true }
      );
    };
    reader.readAsDataURL(file);
  };
  const onDeleteImage = () => {
    setProfileImage(null);
    axios.post(
      `${process.env.REACT_APP_SERVER_URL}/api/account/delete-image`,
      {},
      { withCredentials: true }
    );
  };

  const renderField = (label, field, type = "text") => (
    <div className="input-with-button" key={field}>
      <label>{label}:</label>
      <div className="input-container">
        {field !== "gender" ? (
          <input
            type={type}
            value={userData[field]}
            disabled={!isEditing[field]}
            onChange={(e) => handleChange(field, e.target.value)}
            className={`full-width-input ${errors[field] ? "input-error" : ""}`}
          />
        ) : (
          <select
            value={userData.gender}
            disabled={!isEditing.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
            className={`full-width-input ${errors.gender ? "input-error" : ""}`}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        )}
        <button
          className={`edit-btn ${isEditing[field] ? "save" : ""}`}
          onClick={() => toggleEdit(field)}
        >
          {isEditing[field] ? "Save" : "Edit"}
        </button>
      </div>
      {errors[field] && <span className="field-error">{errors[field]}</span>}
    </div>
  );

  return (
    <div className="account-inf-container">
      <div className="account-inf-card">
        <div className="profile-picture-section">
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="profile-image" />
          ) : (
            <div className="profile-placeholder">
              <FaUserCircle size={100} />
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: "none" }}
            onChange={onFileChange}
          />
          <div className="picture-buttons">
            <button onClick={handleUpload} className="upload-btn">
              Upload
            </button>
            <button
              onClick={onDeleteImage}
              className="delete-btn"
              disabled={!profileImage}
            >
              Delete
            </button>
          </div>
        </div>
        {renderField("Full Name", "fullName")}
        {renderField("Email", "email", "email")}
        {renderField("Mobile Number", "mobileNumber")}
        {renderField("Gender", "gender")}
        {renderField("Address", "address")}
        {renderField("Age", "age", "number")}
        {renderField("Password", "password", "password")}
      </div>
    </div>
  );
}





// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import "../style/AccountInf.css";
// import { FaUserCircle } from 'react-icons/fa';
// const userId = 1; // Replace with dynamic value later (from login, localStorage, etc.)

// function AccountInf() {
//     // ... (rest of your component code)
//     const [isEditing, setIsEditing] = useState({
//         fullName: false,
//         email: false,
//         mobileNumber: false,
//         gender: false,
//         address: false,
//         age: false,
//         password: false
//     });

//     const [userData, setUserData] = useState({
//         fullName: "",
//         email: "",
//         mobileNumber: "",
//         gender: "",
//         address: "",
//         age: "",
//         password: ""
//     });

//     const [profileImage, setProfileImage] = useState(null);
//     const fileInputRef = useRef(null);


    
//     useEffect(() => {
//         axios.post("http://localhost:3001/api/account", { userId}) // Replace 1 with dynamic value later
//             .then((res) => {
//                 if (res.data) {
//                     setUserData({
//                         fullName: res.data.fullName, // already provided
//                         email: res.data.email,
//                         mobileNumber: res.data.mobileNumber,
//                         gender: res.data.gender,
//                         address: res.data.address,
//                         age: res.data.age,
//                         password: "" // Leave blank or masked
//                     });
//                     setProfileImage(res.data.profileImage || null); // match backend key
//                 }
//             })
//             .catch((err) => {
//                 console.error("Failed to load account data:", err);
//             });
//     }, []);
    

//     const toggleEdit = (field) => {
//         if (isEditing[field]) {
//             // Save changes
         
//             axios.post("http://localhost:3001/api/account/update", { userId, [field]: userData[field] })
//                 .then(() => {
//                     console.log(`${field} updated successfully`);
//                 })
//                 .catch(err => {
//                     console.error(`Error updating ${field}:`, err);
//                 });
//         }
//         setIsEditing(prev => ({ ...prev, [field]: !prev[field] }));
//     };

//     const handleInputChange = (field, value) => {
//         setUserData(prev => ({ ...prev, [field]: value }));
//     };

//     const handleUploadClick = () => {
//         fileInputRef.current.click();
//     };

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 const imageData = reader.result;
//                 setProfileImage(imageData);

//                 axios.post("http://localhost:3001/api/account/upload-image", { userId, image: imageData })
//                     .then(() => console.log("Profile image uploaded"))
//                     .catch(err => console.error("Error uploading image:", err));
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleDeleteImage = () => {
//         setProfileImage(null);
//         axios.post("http://localhost:3001/api/account/delete-image", { userId })
//             .then(() => console.log("Profile image deleted"))
//             .catch(err => console.error("Error deleting image:", err));
//     };

//     const renderField = (label, field, type = "text") => (
//         <>
//             <h2>{label}:</h2>
//             <div className="input-with-button">
//                 <input
//                     type={type}
//                     value={userData[field] || ""}
//                     disabled={!isEditing[field]}
//                     onChange={(e) => handleInputChange(field, e.target.value)}
//                     className="full-width-input"
//                     placeholder={`Enter ${label.toLowerCase()}`}
//                 />
//                 <button
//                     className={`edit-btn ${isEditing[field] ? "save" : ""}`}
//                     onClick={() => toggleEdit(field)}
//                 >
//                     {isEditing[field] ? "Save" : "Edit"}
//                 </button>
//             </div>
//         </>
//     );
//     return (
//         <div className="account-inf-container"> 
//             <div className="account-inf-card">
//                 <div className="profile-picture-section">
//                     {profileImage ? (
//                         <img src={profileImage} alt="Profile" className="profile-image" />
//                     ) : (
//                         <div className="profile-placeholder"><FaUserCircle size={100} color="#666" /></div>
//                     )}
//                     <input
//                         type="file"
//                         ref={fileInputRef}
//                         onChange={handleFileChange}
//                         accept="image/*"
//                         style={{ display: "none" }}
//                     />
//                     <div className="picture-buttons">
//                         <button type="button" className="upload-btn" onClick={handleUploadClick}>
//                             Upload
//                         </button>
//                         <button
//                             type="button"
//                             className="delete-btn"
//                             onClick={handleDeleteImage}
//                             disabled={!profileImage}
//                         >
//                             Delete
//                         </button>
//                     </div>
//                 </div>

//                 {renderField("Full Name", "fullName")}
//                 {renderField("Email", "email", "email")}
//                 {renderField("Mobile Number", "mobileNumber")}

//                 <h2>Gender:</h2>
//                 <div className="input-with-button">
//                     <select
//                         value={userData.gender || ""}
//                         disabled={!isEditing.gender}
//                         onChange={(e) => handleInputChange("gender", e.target.value)}
//                         className="full-width-input"
//                     >
//                         <option value="">Select gender</option>
//                         <option value="male">Male</option>
//                         <option value="female">Female</option>
//                     </select>
//                     <button
//                         className={`edit-btn ${isEditing.gender ? "save" : ""}`}
//                         onClick={() => toggleEdit("gender")}
//                     >
//                         {isEditing.gender ? "Save" : "Edit"}
//                     </button>
//                 </div>

//                 {renderField("Address", "address")}
//                 {renderField("Age", "age", "number")}
//                 {renderField("Password", "password", "password")}
//             </div>
//         </div>
//     );
// }

// export default AccountInf;


// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import "../style/AccountInf.css";
// import { FaUserCircle } from 'react-icons/fa';

// function AccountInf() {
//     // ... (rest of your component code)
//     const [isEditing, setIsEditing] = useState({
//         fullName: false,
//         email: false,
//         mobileNumber: false,
//         gender: false,
//         address: false,
//         age: false,
//         password: false
//     });

//     const [userData, setUserData] = useState({
//         fullName: "",
//         email: "",
//         mobileNumber: "",
//         gender: "",
//         address: "",
//         age: "",
//         password: ""
//     });

//     const [profileImage, setProfileImage] = useState(null);
//     const fileInputRef = useRef(null);

//     useEffect(() => {
//         // Fetch user data when component mounts
//         axios.get("/api/account", { withCredentials: true })
//             .then((res) => {
//                 if (res.data) {
//                     setUserData(res.data);
//                     setProfileImage(res.data.profileImage || null);
//                 }
//             })
//             .catch((err) => {
//                 console.error("Failed to load account data:", err);
//             });
//     }, []);

//     const toggleEdit = (field) => {
//         if (isEditing[field]) {
//             // Save changes
//             axios.post("/api/account/update", { [field]: userData[field] }, { withCredentials: true })
//                 .then(() => {
//                     console.log(`${field} updated successfully`);
//                 })
//                 .catch(err => {
//                     console.error(`Error updating ${field}:`, err);
//                 });
//         }
//         setIsEditing(prev => ({ ...prev, [field]: !prev[field] }));
//     };

//     const handleInputChange = (field, value) => {
//         setUserData(prev => ({ ...prev, [field]: value }));
//     };

//     const handleUploadClick = () => {
//         fileInputRef.current.click();
//     };

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 const imageData = reader.result;
//                 setProfileImage(imageData);

//                 axios.post("/api/account/upload-image", { image: imageData }, { withCredentials: true })
//                     .then(() => console.log("Profile image uploaded"))
//                     .catch(err => console.error("Error uploading image:", err));
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleDeleteImage = () => {
//         setProfileImage(null);
//         axios.post("/api/account/delete-image", {}, { withCredentials: true })
//             .then(() => console.log("Profile image deleted"))
//             .catch(err => console.error("Error deleting image:", err));
//     };

//     const renderField = (label, field, type = "text") => (
//         <>
//            <h2 className="field-label">Gender:</h2>
//             <div className="input-with-button">
//                 <input
//                     type={type}
//                     value={userData[field] || ""}
//                     disabled={!isEditing[field]}
//                     onChange={(e) => handleInputChange(field, e.target.value)}
//                     className="full-width-input"
//                     placeholder={`Enter ${label.toLowerCase()}`}
//                 />
//                 <button
//                     className={`edit-btn ${isEditing[field] ? "save" : ""}`}
//                     onClick={() => toggleEdit(field)}
//                 >
//                     {isEditing[field] ? "Save" : "Edit"}
//                 </button>
//             </div>
//         </>
//     );
//     return (
//         <div className="account-inf-container"> 
//             <div className="account-inf-card">
//                 <div className="profile-picture-section">
//                     {profileImage ? (
//                         <img src={profileImage} alt="Profile" className="profile-image" />
//                     ) : (
//                         <div className="profile-placeholder"><FaUserCircle size={100} color="#666" /></div>
//                     )}
//                     <input
//                         type="file"
//                         ref={fileInputRef}
//                         onChange={handleFileChange}
//                         accept="image/*"
//                         style={{ display: "none" }}
//                     />
//                     <div className="picture-buttons">
//                         <button type="button" className="upload-btn" onClick={handleUploadClick}>
//                             Upload
//                         </button>
//                         <button
//                             type="button"
//                             className="delete-btn"
//                             onClick={handleDeleteImage}
//                             disabled={!profileImage}
//                         >
//                             Delete
//                         </button>
//                     </div>
//                 </div>

//                 {renderField("Full Name", "fullName")}
//                 {renderField("Email", "email", "email")}
//                 {renderField("Mobile Number", "mobileNumber")}

//                 <h2>Gender:</h2>
//                 <div className="input-with-button">
//                     <select
//                         value={userData.gender || ""}
//                         disabled={!isEditing.gender}
//                         onChange={(e) => handleInputChange("gender", e.target.value)}
//                         className="full-width-input"
//                     >
//                         <option value="">Select gender</option>
//                         <option value="male">Male</option>
//                         <option value="female">Female</option>
//                     </select>
//                     <button
//                         className={`edit-btn ${isEditing.gender ? "save" : ""}`}
//                         onClick={() => toggleEdit("gender")}
//                     >
//                         {isEditing.gender ? "Save" : "Edit"}
//                     </button>
//                 </div>

//                 {renderField("Address", "address")}
//                 {renderField("Age", "age", "number")}
//                 {renderField("Password", "password", "password")}
//             </div>
//         </div>
//     );
// }

// export default AccountInf;



