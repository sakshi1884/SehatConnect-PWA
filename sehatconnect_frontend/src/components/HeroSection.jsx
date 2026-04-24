import React from "react";
import "./HeroSection.css";
import heroImg from "../assets/images/hero.png";
import { useNavigate } from "react-router-dom";


const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <h1>
          Connecting Patients, Health Workers, and Doctors Seamlessly
        </h1>
        <p>
          SehatConnect empowers health workers (Asha Tai) to bring patients
          closer to doctors with online and offline care solutions.
        </p>
        <div className="hero-buttons">
          <button onClick={() => navigate("/login")} className="primary">
            Get Started
          </button>
         <button
  className="button"
  onClick={() => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  }}
>
  Learn More
</button>
        </div>
      </div>

      <div className="hero-image">
        <img src={heroImg} alt="Doctors" />
      </div>
    </section>
  );
};

export default HeroSection;
