import React, { useEffect, useState } from "react";
import "../style/Educational.css";
import "../style/equipment.css";
import "../style/AgriculturalProject.css";
import Divider from "../layout/leaf.jsx";
import JordanFarmingEquipment from "./equipment.jsx";
import AgriculturalProject from "./AgriculturalProject.jsx";
import { Link } from "react-router-dom";

const ArticleCard = ({ image, alt, title, description, link }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="card" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-aos="fade-up"
    >
      <div className="card-image-container">
        <img src={image} alt={alt} className="card-image" loading="lazy" />
        <div className={`card-overlay ${isHovered ? 'active' : ''}`}>
          <Link to={link} className="overlay-button">View Details</Link>
        </div>
      </div>
      <div className="card-content">
        <h3>{title}</h3>
        <p>{description}</p>
        <Link to={link}>
          <button className="green-button">
            Learn more
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </Link>
      </div>
    </div>
  );
};

const VideoCard = ({ src, title }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="video-card" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-aos="fade-up"
    >
      <div className="video-placeholder">
        <iframe
          src={src}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
        <div className={`video-overlay ${isHovered ? 'active' : ''}`}>
          <div className="play-button">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 3L19 12L5 21V3Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </div>
      <p>{title}</p>
    </div>
  );
};

const Educational = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.card, .video-card, .section-header').forEach(el => {
      observer.observe(el);
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

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

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-skeleton" style={{ height: '200px', width: '100%' }}></div>
        <div className="loading-skeleton" style={{ height: '100px', width: '80%', margin: '20px auto' }}></div>
        <div className="loading-skeleton" style={{ height: '300px', width: '100%' }}></div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <main className="educational-content">
        <section className="hero-section">
          <h1 className="hero-title">Agricultural Education</h1>
          <p className="hero-subtitle">
            Master sustainable farming practices and modern techniques to boost your agricultural productivity.
          </p>
        </section>

        <section className="cards-section">
          {articles.map(article => (
            <ArticleCard key={article.id} {...article} />
          ))}
        </section>

        <Divider />

        <section className="section-header">
          <h2>Featured Projects</h2>
        </section>
        <AgriculturalProject />

        <Divider />

        <section className="educational-videos">
          <div className="section-header">
            <h2>Educational Videos</h2>
          </div>
          <div className="video-grid">
            {videos.map(video => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </section>

        <Divider />

        <section className="section-header">
          <h2>Farming Equipment</h2>
        </section>
        <JordanFarmingEquipment />
      </main>
    </div>
  );
};

export default Educational;
