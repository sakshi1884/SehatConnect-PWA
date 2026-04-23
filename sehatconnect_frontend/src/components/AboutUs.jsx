import React from "react";
import "./AboutUs.css";
import earthImg from "../assets/images/earth.png";
import heartImg from "../assets/images/heart.png";
import linkImg from "../assets/images/link.png";
import targetImg from "../assets/images/target.png";
const AboutUs = () => {
  const cards = [
    {
      title: "Our Mission",
      text: "Our mission is to make healthcare accessible to every individual by empowering local health workers and connecting them to doctors.",
      img :targetImg
    },
    {
      title: "How it works",
      text: "Health workers (Asha Tai) assist patients in registering, tracking health, and connecting with doctors — both online and offline.",
      img: linkImg
    },
    {
      title: "Why SehatConnect",
      text: "Offline-first technology ensures healthcare services are available even in areas with poor internet. Secure, and easy.",
      img: earthImg
    },
    {
      title: "Our Impact",
      text: "Improving healthcare accessibility, reducing delays in diagnosis, and bridging rural-urban healthcare gaps.",
      img: heartImg
    },
  ];

  return (
    <section className="about-section" id="about">
      <h2 className="about-heading">About Us</h2>
      <div className="cards-container">
        {cards.map((card, index) => (
          <div className="card" key={index}>
            <img src={card.img} alt={card.title} className="card-icon" />
            <h3 className="card-title">{card.title}</h3>
            <p className="card-text">{card.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutUs;
