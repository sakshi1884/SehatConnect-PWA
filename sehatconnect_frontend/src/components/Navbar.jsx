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
        <li><button onClick={() => scrollTo("home")}>Home</button></li>
        <li><button onClick={() => scrollTo("about")}>About</button></li>
        <li><button onClick={() => scrollTo("contact")}>Contact</button></li>
        <li>
          <Link to="/login">Log in</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
