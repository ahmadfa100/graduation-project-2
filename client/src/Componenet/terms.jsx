import React from "react";
import "../style/terms.css";
import { blue } from "@mui/material/colors";

function Terms() {
  return (
    <div className="terms-page">
      <div className="terms-container">
        <h1>Terms of Service</h1>
        
        <section className="terms-section">
          <h2>1. Agreement to Terms</h2>
          <div className="terms-content">
            <p>By accessing and using Green Bridge's agricultural land management platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
          </div>
        </section>

        <section className="terms-section">
          <h2>2. User Accounts</h2>
          <div className="terms-content">
            <h3>2.1 Account Creation</h3>
            <p>To use certain features of our platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process.</p>
            
            <h3>2.2 Account Security</h3>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.</p>
          </div>
        </section>

        <section className="terms-section">
          <h2>3. Land Management</h2>
          <div className="terms-content">
            <h3>3.1 Landowner Responsibilities</h3>
            <p>Landowners must provide accurate information about their properties and maintain transparency in all dealings with farmers. This includes disclosing any known issues with the land and maintaining proper documentation.</p>
            
            <h3>3.2 Farmer Responsibilities</h3>
            <p>Farmers must demonstrate their qualifications and experience in agricultural management. They are responsible for maintaining the land according to agreed-upon terms and local regulations.</p>
          </div>
        </section>

        <section className="terms-section">
          <h2>4. Payment Terms</h2>
          <div className="terms-content">
            <h3>4.1 Service Fees</h3>
            <p>Green Bridge charges a service fee for facilitating land rentals. All fees are clearly stated before any transaction is completed.</p>
            
            <h3>4.2 Payment Processing</h3>
            <p>Our platform does not process or store any payment information. Payments are arranged directly
               between the farmer and the landowner outside the application. However, landowners are advised not
                to rent out their land until payment is received, and farmers should confirm payment before proceeding</p>
          </div>
        </section>

        <section className="terms-section">
          <h2>5. Intellectual Property</h2>
          <div className="terms-content">
            <p>All content on this platform, including but not limited to text, graphics, logos, and software, is the property of Green Bridge and is protected by intellectual property laws.</p>
          </div>
        </section>

        <section className="terms-section">
          <h2>6. Limitation of Liability</h2>
          <div className="terms-content">
            <p>Green Bridge shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.</p>
          </div>
        </section>

        <section className="terms-section">
          <h2>7. Changes to Terms</h2>
          <div className="terms-content">
            <p>We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the platform.</p>
          </div>
        </section>

        <section className="terms-section">
          <h2>8. Contact Information</h2>
          <div className="terms-content">
            <p>For any questions regarding these Terms of Service, please contact us through our support channels or by <a href="/contact" style={{color:'blue' }}>contact us</a> page.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Terms; 