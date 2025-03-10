import React, { useState } from "react";
import "../style/AgriculturalProject.css"; 

export default function AgriculturalProject() {
  const [showMore1, setShowMore1] = useState(false);
  const [showMore2, setShowMore2] = useState(false);
  const [showMore3, setShowMore3] = useState(false);

  return (
    <section className="agricultural-project">
      <h2>Start an Agricultural Project in Jordan</h2>
      <p className="section-intro">
        Comprehensive guidelines for planning and implementing a successful agricultural project, making use of local resources.
      </p>

      <div className="project-steps">
        
        {/* First Card */}
        <div className="step-item">
          <div>
            <h4>Local Agricultural Planning</h4>
            <p>
              Learn how to develop an agricultural business plan that takes into account climate, soil, and modern technologies in Jordan.
            </p>
            {showMore1 && (
              <div className="read-more-content">
                <p>
                  In this section, we review detailed planning strategies, including selecting appropriate crops, allocating resources, and controlling costs to ensure the sustainability of the project.
                </p>
              </div>
            )}
          </div>
          <button
            type="button"
            className="green-button"
            onClick={() => setShowMore1(!showMore1)}
          >
            {showMore1 ? "Hide details" : "Read more"}
          </button>
        </div>

        {/* Second Card */}
        <div className="step-item">
          <div>
            <h4>Access to Funding</h4>
            <p>
              Discover local funding sources and governmental and private support to help you start your agricultural project.
            </p>
            {showMore2 && (
              <div className="read-more-content">
                <p>
                  This includes collaboration with local banks and small project support programs that offer facilitated loans and advisory services for the agricultural sector.
                </p>
              </div>
            )}
          </div>
          <button
            className="green-button"
            onClick={() => setShowMore2(!showMore2)}
          >
            {showMore2 ? "Hide details" : "Read more"}
          </button>
        </div>

        {/* Third Card */}
        <div className="step-item">
          <div>
            <h4>Risk Management and Sustainability</h4>
            <p>
              Learn about ways to minimize agricultural risks by applying sustainable practices and using modern technologies.
            </p>
            {showMore3 && (
              <div className="read-more-content">
                <p>
                  This includes the use of organic fertilizer, conservation of water resources, and insurance against natural disasters, ensuring better protection for your agricultural investments.
                </p>
              </div>
            )}
          </div>
          <button
            className="green-button"
            onClick={() => setShowMore3(!showMore3)}
          >
            {showMore3 ? "Hide details" : "Read more"}
          </button>
        </div>
      </div>
    </section>
  );
}
