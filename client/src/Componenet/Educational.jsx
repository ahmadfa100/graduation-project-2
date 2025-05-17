import React from "react";
import "../style/Educational.css";
import "../style/equipment.css";
import "../style/AgriculturalProject.css";
import Divider from "../layout/leaf.jsx";

import JordanFarmingEquipment from "./equipment.jsx";
import AgriculturalProject from "./AgriculturalProject.jsx";
import { Link } from "react-router-dom";



// Reusable Card component for articles
const ArticleCard = ({ image, alt, title, description, link }) => (
  <div className="card">
    <img src={image} alt={alt} className="card-image" />
    <h3>{title}</h3>
    <p>{description}</p>
    <Link to={link}>
      <button className="green-button">Learn more</button>
    </Link>
  </div>
);

// Reusable VideoCard component
const VideoCard = ({ src, title }) => (
  <div className="video-card">
    <div className="video-placeholder">
      <iframe
        src={src}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
    <p>{title}</p>
  </div>
);

const Educational = () => {
  const articles = [
    {
      id: 1,
      image: "https://images.pexels.com/photos/1000057/pexels-photo-1000057.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Soil Improvement",
      title: "Soil Improvement",
      description: "Boost soil health sustainably with composting, cover crops, and other eco-friendly practices.",
      link: "/article/1",
    },
    {
      id: 2,
      image: "https://i.pinimg.com/736x/30/a6/47/30a647babaa06dde6d064458301df75a.jpg",
      alt: "Efficient Irrigation Methods",
      title: "Efficient Irrigation Methods",
      description: "Implement water-efficient irrigation (drip, sprinkler) to maximize yield and save resources.",
      link: "/article/2",
    },
    {
      id: 3,
      image: "https://i.pinimg.com/736x/3e/3f/6b/3e3f6b67c4d46ebe9d0e10f44dea1f71.jpg",
      alt: "Sustainable Pest Management",
      title: "Sustainable Pest Management",
      description: "Use organic pest controls—natural predators and eco-safe treatments—to protect crops.",
      link: "/article/3",
    },
  ];

  const videos = [
    {
      id: 1,
      src: "https://www.youtube.com/embed/b4h_jyWjKNQ",
      title: "Modern Farming Techniques",
    },
    {
      id: 2,
      src: "https://www.youtube.com/embed/Y73frItuI2g",
      title: "How to Use Farming Tools",
    },
    {
      id: 3,
      src: "https://www.youtube.com/embed/8K9PMxBktJI",
      title: "Increasing Agricultural Productivity",
    },
  ];

  return (
    <div className="home-page">
      <main className="educational-content">
        <section className="cards-section">
          {articles.map(article => (
            <ArticleCard key={article.id} {...article} />
          ))}
        </section>

        <Divider />

        <AgriculturalProject />

        <Divider />

        <section className="educational-videos">
          <h2>Educational Videos</h2>
          <div className="video-grid">
            {videos.map(video => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </section>

        <Divider />

        <JordanFarmingEquipment />
      </main>
    </div>
  );
};

export default Educational;
