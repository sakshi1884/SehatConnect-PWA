import React, { useState } from "react";
import "./Navbar.css";
import logo from "../assets/images/logo-512.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav>
      <div className="navbar-logo">
        <img src={logo} alt="SehatConnect Logo" />
        <h1>SehatConnect</h1>
      </div>

      {/* Hamburger icon */}
      <div
        className={`hamburger ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Navbar links */}
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
        <li>
          <Link to="/login">Log in</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
