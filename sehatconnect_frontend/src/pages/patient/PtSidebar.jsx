import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Stylesheets/PtSidebar.css";
import defaultAvatar from "../../assets/images/healthworker.jpg";
import { useTranslation } from "react-i18next";

const PtSidebar = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // =========================
  // LOAD PROFILE FROM LOCALSTORAGE
  // =========================
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("patientData"));

    // handle both cases (nested + direct)
    const patient = stored?.patient || stored;

    if (patient) {
      setProfile(patient);
    }
  }, []);

  const ptId = profile?._id || profile?.id;

  // =========================
  // NAVIGATION HANDLER
  // =========================
  const handleNavigate = (path) => {
    if (!ptId) return;

    navigate(path);
    onClose?.();
  };

  // =========================
  // LOGOUT HANDLER
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("patientData");

    navigate("/login");
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      
      {/* ================= HEADER ================= */}
      <div className="sidebar-header">
        <img
          src={profile?.profilePhoto || defaultAvatar} // ✅ fixed field
          alt="Patient Avatar"
          className="sidebar-avatar"
          onError={(e) => {
            e.target.src = defaultAvatar;
          }}
        />

        <p className="sidebar-name">
          {profile?.fullName || "Patient"}
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
        <li onClick={() => handleNavigate(`/patient/${ptId}`)}>
          🏠 {t("home")}
        </li>

        <li onClick={() => handleNavigate(`/patient/${ptId}/dashboard`)}>
          ➕ {t("dashboard")}
        </li>

        <li onClick={() => handleNavigate(`/patient/${ptId}/history`)}>
          👥 {t("history")}
        </li>

        <li onClick={() => handleNavigate(`/patient/${ptId}/details`)}>
          🏥 {t("details")}
        </li>

        <li onClick={() => handleNavigate(`/patient/${ptId}/profile`)}>
          👤 {t("profile")}
        </li>

        <li onClick={handleLogout}>
          🚪 {t("logout")}
        </li>
      </ul>
    </div>
  );
};

export default PtSidebar;