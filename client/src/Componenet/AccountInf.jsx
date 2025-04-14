import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../style/AccountInf.css";
import { FaUserCircle } from 'react-icons/fa';

function AccountInf() {
    // ... (rest of your component code)
    const [isEditing, setIsEditing] = useState({
        fullName: false,
        email: false,
        mobileNumber: false,
        gender: false,
        address: false,
        age: false,
        password: false
    });

    const [userData, setUserData] = useState({
        fullName: "",
        email: "",
        mobileNumber: "",
        gender: "",
        address: "",
        age: "",
        password: ""
    });

    const [profileImage, setProfileImage] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        // Fetch user data when component mounts
        axios.get("/api/account", { withCredentials: true })
            .then((res) => {
                if (res.data) {
                    setUserData(res.data);
                    setProfileImage(res.data.profileImage || null);
                }
            })
            .catch((err) => {
                console.error("Failed to load account data:", err);
            });
    }, []);

    const toggleEdit = (field) => {
        if (isEditing[field]) {
            // Save changes
            axios.post("/api/account/update", { [field]: userData[field] }, { withCredentials: true })
                .then(() => {
                    console.log(`${field} updated successfully`);
                })
                .catch(err => {
                    console.error(`Error updating ${field}:`, err);
                });
        }
        setIsEditing(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleInputChange = (field, value) => {
        setUserData(prev => ({ ...prev, [field]: value }));
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageData = reader.result;
                setProfileImage(imageData);

                axios.post("/api/account/upload-image", { image: imageData }, { withCredentials: true })
                    .then(() => console.log("Profile image uploaded"))
                    .catch(err => console.error("Error uploading image:", err));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteImage = () => {
        setProfileImage(null);
        axios.post("/api/account/delete-image", {}, { withCredentials: true })
            .then(() => console.log("Profile image deleted"))
            .catch(err => console.error("Error deleting image:", err));
    };

    const renderField = (label, field, type = "text") => (
        <>
            <h2>{label}:</h2>
            <div className="input-with-button">
                <input
                    type={type}
                    value={userData[field] || ""}
                    disabled={!isEditing[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="full-width-input"
                    placeholder={`Enter ${label.toLowerCase()}`}
                />
                <button
                    className={`edit-btn ${isEditing[field] ? "save" : ""}`}
                    onClick={() => toggleEdit(field)}
                >
                    {isEditing[field] ? "Save" : "Edit"}
                </button>
            </div>
        </>
    );
    return (
        <div className="account-inf-container"> 
            <div className="account-inf-card">
                <div className="profile-picture-section">
                    {profileImage ? (
                        <img src={profileImage} alt="Profile" className="profile-image" />
                    ) : (
                        <div className="profile-placeholder"><FaUserCircle size={100} color="#666" /></div>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        style={{ display: "none" }}
                    />
                    <div className="picture-buttons">
                        <button type="button" className="upload-btn" onClick={handleUploadClick}>
                            Upload
                        </button>
                        <button
                            type="button"
                            className="delete-btn"
                            onClick={handleDeleteImage}
                            disabled={!profileImage}
                        >
                            Delete
                        </button>
                    </div>
                </div>

                {renderField("Full Name", "fullName")}
                {renderField("Email", "email", "email")}
                {renderField("Mobile Number", "mobileNumber")}

                <h2>Gender:</h2>
                <div className="input-with-button">
                    <select
                        value={userData.gender || ""}
                        disabled={!isEditing.gender}
                        onChange={(e) => handleInputChange("gender", e.target.value)}
                        className="full-width-input"
                    >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    <button
                        className={`edit-btn ${isEditing.gender ? "save" : ""}`}
                        onClick={() => toggleEdit("gender")}
                    >
                        {isEditing.gender ? "Save" : "Edit"}
                    </button>
                </div>

                {renderField("Address", "address")}
                {renderField("Age", "age", "number")}
                {renderField("Password", "password", "password")}
            </div>
        </div>
    );
}

export default AccountInf;



