import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h3 className="footer-logo">SehatConnect</h3>

        <div className="footer-socials">
          <a
            href="https://facebook.com"
            className="social facebook"
            aria-label="Facebook"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-facebook"></i>
          </a>

          <a
            href="https://instagram.com"
            className="social instagram"
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-instagram"></i>
          </a>

          <a
            href="https://linkedin.com"
            className="social linkedin"
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-linkedin"></i>
          </a>
        </div>

        <div className="footer-links">
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
          <a href="/cookies">Cookies</a>
        </div>

        <p className="footer-copy">
          © 2025 SehatConnect — All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;