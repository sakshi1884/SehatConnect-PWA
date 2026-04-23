import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Stylesheets/HealthworkerSidebar.css";
import defaultAvatar from "../../assets/images/healthworker.jpg";

const HealthworkerSidebar = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  // =========================
  // LOAD PROFILE FROM LOCALSTORAGE
  // =========================
  useEffect(() => {
    const storedProfile = JSON.parse(
      localStorage.getItem("healthworkerProfile")
    );

    if (storedProfile) {
      setProfile(storedProfile);
    }
  }, []);

  const hwId = profile?._id || profile?.id;

  // =========================
  // NAVIGATION HANDLER
  // =========================
  const handleNavigate = (path) => {
    if (!hwId) return;

    navigate(path);
    onClose?.();
  };

  // =========================
  // LOGOUT HANDLER
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("healthworkerProfile");

    navigate("/login");
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      
      {/* ================= HEADER ================= */}
      <div className="sidebar-header">
        <img
          src={profile?.profilePic || defaultAvatar}
          alt="Healthworker Avatar"
          className="sidebar-avatar"
          onError={(e) => {
            e.target.src = defaultAvatar;
          }}
        />

        <p className="sidebar-name">
          {profile?.fullName || "Healthworker"}
        </p>
        <p className="sidebar-email">
          {profile?.email || "No email"}
        </p>

        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      {/* ================= MENU ================= */}
      <ul className="sidebar-menu">
        <li onClick={() => handleNavigate(`/healthworker/${hwId}`)}>
          🏠 Home
        </li>

        <li
          onClick={() =>
            handleNavigate(`/healthworker/${hwId}/addpatient`)
          }
        >
          ➕ Add Patient
        </li>

        <li
          onClick={() =>
            handleNavigate(`/healthworker/${hwId}/allpatients`)
          }
        >
          👥 All Patients
        </li>

        <li
          onClick={() =>
            handleNavigate(`/healthworker/${hwId}/healthcamps`)
          }
        >
          🏥 Health Camps
        </li>

        <li
          onClick={() =>
            handleNavigate(`/healthworker/${hwId}/profile`)
          }
        >
          👤 Profile
        </li>

        <li onClick={handleLogout}>
          🚪 Logout
        </li>
      </ul>
    </div>
  );
};

export default HealthworkerSidebar;