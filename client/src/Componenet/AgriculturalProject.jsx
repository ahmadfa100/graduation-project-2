import React, { useState } from "react";
import "../style/AgriculturalProject.css"; 

export default function AgriculturalProject() {
  const [showMore1, setShowMore1] = useState(false);
  const [showMore2, setShowMore2] = useState(false);
  const [showMore3, setShowMore3] = useState(false);

  return (
    <section className="agricultural-project">
      <h2>Launch Your Sustainable Agricultural Venture in Jordan</h2>
      <p className="section-intro">
        Step-by-step insights for landowners and farmers to collaborate on eco-friendly, profitable agricultural projects—leveraging local expertise, resources, and cutting-edge practices.
      </p>

      <div className="project-steps">
        {/* Strategic Farm Planning */}
        <div className="step-item">
          <div>
            <h4>Strategic Farm Planning</h4>
            <p>
              Craft a robust agricultural plan tailored to Jordan’s climate zones and soil types—integrating crop selection, resource allocation, and tech adoption.
            </p>
            {showMore1 && (
              <div className="read-more-content">
                <p>
                  Delve into crop-suitability analysis and seasonal scheduling to optimize yields: evaluate soil pH, nutrient profiles, and water availability. Map land-use zones, build budget forecasts, and set performance KPIs to track productivity, profitability, and sustainability over time.
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

        {/* Financing & Grants */}
        <div className="step-item">
          <div>
            <h4>Financing & Grants</h4>
            <p>
              Unlock funding avenues—government subsidies, micro-loans, and private investors—to launch and scale your farm sustainably.
            </p>
            {showMore2 && (
              <div className="read-more-content">
                <p>
                  Learn how to prepare strong loan applications, leverage FAO and GIZ grant programs, and partner with agricultural cooperatives. Explore crowd-farming platforms and impact investors focused on sustainable agriculture in Jordan.
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

        {/* Risk Mitigation & Sustainability */}
        <div className="step-item">
          <div>
            <h4>Risk Mitigation & Sustainability</h4>
            <p>
              Implement resilient practices—cover crops, drip irrigation, soil health monitoring—and safeguard investments against climate and market risks.
            </p>
            {showMore3 && (
              <div className="read-more-content">
                <p>
                  Adopt weather-based forecasting, index insurance, and digital dashboards for real-time monitoring of soil moisture and pest incidence. Integrate agroforestry, organic amendments, and rainwater harvesting systems to enhance ecosystem services and ensure long-term viability.
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
