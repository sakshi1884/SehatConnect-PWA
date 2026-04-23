import React from "react";
import "./ContactUs.css";

const ContactUs = () => {
  return (
    <section className="contact-section" id="contact">
      <h1 className="contact-heading" >Contact us</h1>
      <div className="contact-container">
        <h2 className="contact-title">
          We're here for all your Snoozed Questions!!
        </h2>
        <p className="contact-subtitle">Contact Us</p>

        <div className="contact-info">
          <p>📞 +91-XXXXXXXXXX</p>
          <p>📧 support@sehatconnect.in</p>
          <p>📍 SehatConnect HQ, Kolhapur, Maharashtra</p>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
