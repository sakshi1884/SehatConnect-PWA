import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h3 className="footer-logo">SehatConnect</h3>

        <div className="footer-socials">
          
          <a href="#" className="social facebook" aria-label="Facebook">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="#" className="social instagram" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" className="social linkedin" aria-label="GitHub">
            <i className="fab fa-linkedin"></i>
          </a>
        </div>

        <div className="footer-links">
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Cookies</a>
        </div>

        <p className="footer-copy">© 2025 SehatConnect — All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
