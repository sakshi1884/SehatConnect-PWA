import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./HealthworkerSidebar";
import "./Stylesheets/HNavbar.css";

const HNavbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState({}); 

  const navigate = useNavigate();

  useEffect(() => {
    const storedProfile = JSON.parse(
      localStorage.getItem("healthworkerProfile")
    );
    if (storedProfile) {
      setProfile(storedProfile);
    }
  }, []);

  const hwId = profile?._id;

  const handleLogoClick = () => {
    if (hwId) navigate(`/healthworker/${hwId}`);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <button
            className="menu-icon"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>

          <h2 className="navbar-logo" onClick={handleLogoClick}>
            SehatConnect
          </h2>
        </div>

        <div className="search-bar">
          <input type="text" placeholder="Search Patients" />
          <button className="crossBtn">✕</button>
        </div>

        <div className="navbar-right">
          <a
            onClick={() => {
              if (hwId) navigate(`/healthworker/${hwId}/profile`);
            }}
          >
            Profile
          </a>

          <a
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              localStorage.removeItem("healthworkerProfile");
              navigate("/login");
            }}
          >
            Logout
          </a>
        </div>
      </nav>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </>
  );
};

export default HNavbar;