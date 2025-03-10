import React from 'react';
import '../style/Educational.css';

function JordanFarmingEquipment() {
  return (
    <section className="jordan-farming-equipment">
      <h2>Find the Right Equipment in Jordan</h2>
      <p>
        Whether you need tractors, irrigation systems, or other agricultural machinery, 
        these trusted sources will help you find what fits your farm’s needs.
      </p>

      <div className="equipment-grid">
        {/* Card 1 */}
        <div className="equipment-card">
          <img
            src="./Helpful Websites/logo_back.png"
            alt="Jordan Tractor"
            />
          <h3>Jordan Tractor</h3>
          <p>
            Discover a variety of John Deere tractors and equipment suitable for 
            different farm sizes and requirements.
          </p>
          <a
            href="https://jordantractor.com/v1/jo/en/products/new/category/14444"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Jordan Tractor
          </a>
        </div>

        {/* Card 2 */}
        <div className="equipment-card">
          <img
            src="./Helpful Websites/Rama.png"
            alt="Rama Jordan"
          />
          <h3>Rama Jordan</h3>
          <p>
            Explore an extensive range of agricultural solutions, 
            from greenhouse systems to advanced irrigation technologies.
          </p>
          <a
            href="https://www.ramajordan.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Rama Jordan
          </a>
        </div>

        {/* Card 3 */}
        <div className="equipment-card">
          <img
            src="./Helpful Websites/Micdadi.png"
            alt="AMC Jordan"
          />
          <h3>AMC Jordan</h3>
          <p>
            AMC provides specialized machinery for orchards, 
            field crops, and a range of other agricultural needs.
          </p>
          <a
            href="https://amc.jo/"
            target="_blank"
            rel="noopener noreferrer"
            >
            Visit AMC Jordan
          </a>
        </div>
      </div>
    </section>
  );
}

export default JordanFarmingEquipment;
