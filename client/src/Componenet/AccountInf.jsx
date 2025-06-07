import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../style/AccountInf.css";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  if (!/[!@#$%^&*(),.?\":{}|<>\-_=+\[\]\\/;'~]/.test(pw))
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
    confirmPassword: ""
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
    axios.get(`${process.env.REACT_APP_SERVER_URL}/api/check-session`, { withCredentials: true })
      .then(() => {
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
              confirmPassword: ""
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
    confirmPassword: (cp) => 
      cp !== userData.password ? "Passwords do not match" : ""
  };

  const toggleEdit = (field) => {
    if (isEditing[field]) {
      if (field === "password") {
        const pwError = validatePassword(userData.password);
        const cpError = userData.confirmPassword !== userData.password 
          ? "Passwords do not match" 
          : "";
        
        if (pwError || cpError) {
          setErrors({
            ...errors,
            password: pwError,
            confirmPassword: cpError
          });
          toast.error(`Failed to update ${field}: ${pwError || cpError}`);
          return;
        }
      } else {
        const err = validators[field](userData[field]);
        if (err) {
          setErrors((e) => ({ ...e, [field]: err }));
          toast.error(`Failed to update ${field}: ${err}`);
          return;
        }
      }

      setErrors((e) => ({ ...e, [field]: "", confirmPassword: "" }));

      axios
        .post(
          `${process.env.REACT_APP_SERVER_URL}/api/account/update`,
          field === "password" 
            ? { password: userData.password }
            : { [field]: userData[field] },
          { withCredentials: true }
        )
        .then(() => {
          console.log(`${field} updated`);
          toast.success(`Successfully updated ${field}`);
          if (field === "password") {
            setUserData(prev => ({ ...prev, password: "", confirmPassword: "" }));
          }
        })
        .catch((e) => {
          console.error(e);
          if (e.response?.status === 401) {
            navigate("/login");
          } else {
            const errorMessage = e.response?.data?.error || "Update failed";
            setErrors((errState) => ({
              ...errState,
              [field]: errorMessage,
            }));
            toast.error(`Failed to update ${field}: ${errorMessage}`);
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
    if (field === "password" || field === "confirmPassword") {
      setErrors((e) => ({ ...e, confirmPassword: "" }));
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
      )
      .then(() => {
        toast.success('Profile picture updated successfully');
      })
      .catch((err) => {
        toast.error('Failed to update profile picture');
        console.error(err);
      });
    };
    reader.readAsDataURL(file);
  };
  const onDeleteImage = () => {
    setProfileImage(null);
    axios.post(
      `${process.env.REACT_APP_SERVER_URL}/api/account/delete-image`,
      {},
      { withCredentials: true }
    )
    .then(() => {
      toast.success('Profile picture deleted successfully');
    })
    .catch((err) => {
      toast.error('Failed to delete profile picture');
      console.error(err);
    });
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
      <ToastContainer position="top-right" autoClose={5000} />
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
        {renderField("New Password", "password", "password")}
        
        <div className="input-with-button">
          <label>Confirm Password:</label>
          <div className="input-container">
            <input
              type="password"
              value={userData.confirmPassword}
              disabled={!isEditing.password}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              className={`full-width-input ${errors.confirmPassword ? "input-error" : ""}`}
            />
          </div>
          {errors.confirmPassword && (
            <span className="field-error">{errors.confirmPassword}</span>
          )}
        </div>
      </div>
    </div>
  );
}




