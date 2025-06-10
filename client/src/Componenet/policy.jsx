import React from "react";
import "../style/policy.css";

function Policy() {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <h1>Our Policies</h1>
        
        <section className="policy-section">
          <h2>Terms of Service</h2>
          <div className="policy-content">
            <h3>1. Acceptance of Terms</h3>
            <p>By accessing and using our agricultural land management platform, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
            
            <h3>2. User Responsibilities</h3>
            <p>Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.</p>
            
            <h3>3. Land Management Guidelines</h3>
            <p>All agricultural activities must comply with local environmental regulations and sustainable farming practices.</p>
          </div>
        </section>

        <section className="policy-section">
          <h2>Privacy Policy</h2>
          <div className="policy-content">
            <h3>1. Information Collection</h3>
            <p>We collect information that you provide directly to us, including name, contact information, and land management preferences.</p>
            
            <h3>2. Data Protection</h3>
            <p>We implement appropriate security measures to protect your personal information from unauthorized access or disclosure.</p>
            
            <h3>3. Information Sharing</h3>
            <p>We do not sell or rent your personal information to third parties without your explicit consent.</p>
          </div>
        </section>

        <section className="policy-section">
          <h2>User Guidelines</h2>
          <div className="policy-content">
            <h3>1. Landowner Guidelines</h3>
            <p>Landowners must provide accurate information about their properties and maintain transparency in all dealings with farmers.</p>
            
            <h3>2. Farmer Guidelines</h3>
            <p>Farmers are advised to utilize their land strictly for agricultural purposes. The land should be dedicated to farming activities.</p>
            
            <h3>3. Communication Standards</h3>
            <p>All users must maintain professional and respectful communication when interacting through our platform.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Policy; 