import React from "react";
import "../style/about.css";
function About(){
    return (<div className="mission-container">
        <div className="mission-text">
            <h2>Our Mission</h2>
            <p>We strive to provide a platform that connects agricultural landowners with farmers interested in cultivating and managing the land. We offer innovative solutions that help the owner showcase their land and communicate with qualified farmers to establish a successful partnership.</p>
            <p>Our goal is to enhance agricultural production and achieve sustainability by providing the right tools for both the owner and the farmer.</p>
        </div>
        <div className="mission-image">
            <img src="./aboutPicture.jpg" alt="Tractor on farmland"/>
        </div>
    </div>);
}
export default About;