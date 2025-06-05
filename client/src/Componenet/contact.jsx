import React, { useState } from "react";
import { FaEnvelope, FaPhone, FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";
import "../style/contact.css";
import { useNotifications } from '@toolpad/core/useNotifications';
import axios from "axios";

function Contact() {
   const notifications = useNotifications();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/contact/send-message`, 
      formData,
    {  withCredentials: true}
      );


      if (response.status === 200) {
       notifications.show("Message sent successfully!", {
        severity: "success",
        autoHideDuration: 3000,
       });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        notifications.show("Failed to send message. Please try again.", {
          severity: "error",
          autoHideDuration: 3000,
        });
      }
    } catch (error) {

      console.error("Error sending message:", error);
      notifications.show("An error occurred while sending your message.", {
        severity: "error",
        autoHideDuration: 3000,
      });
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1>Contact Us</h1>
        
        <div className="contact-content">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>We'd love to hear from you. Please use any of the following methods to reach us:</p>
            
            <div className="contact-methods">
              <div className="contact-method">
                <FaEnvelope className="contact-icon" />
                <div>
                  <h3>Email</h3>
                  <p>greenbridgezar@gmail.com</p>
                </div>
              </div>
              
              <div className="contact-method">
                <FaPhone className="contact-icon" />
                <div>
                  <h3>Phone</h3>
                  <p>+962 79 955 421</p>
                </div>
              </div>
              
              <div className="contact-method">
                <FaWhatsapp className="contact-icon" />
                <div>
                  <h3>WhatsApp</h3>
                  <p>+962 79 955 421</p>
                </div>
              </div>

              <div className="contact-method">
                <FaMapMarkerAlt className="contact-icon" />
                <div>
                  <h3>Address</h3>
                  <p>Jordan,Irbid</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <h2>Send us a Message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                ></textarea>
              </div>

              <button type="submit" className="submit-button">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact; 