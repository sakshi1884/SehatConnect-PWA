import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./DoctorSidebar";
import "./Stylesheets/DNavbar.css";

const DNavbar = ({ userEmail }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ get doctor from localStorage
  const doc = JSON.parse(localStorage.getItem("doctorProfile"));

  const handleLogoClick = () => {
    if (!doc?._id) {
      navigate("/login");
      return;
    }
    navigate(`/doctor/${doc._id}`);
  };

  const handleProfileClick = () => {
    if (!doc?._id) {
      navigate("/login");
      return;
    }
    navigate(`/doctor/${doc._id}/profile`);
  };

  const handleLogout = () => {
    localStorage.removeItem("doctorProfile");
    localStorage.removeItem("token");
    navigate("/login");
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

        

        <div className="navbar-right">
          {/* ✅ FIXED */}
          <button onClick={handleProfileClick}>Profile</button>

          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userEmail={userEmail}
      />
    </>
  );
};

export default DNavbar;