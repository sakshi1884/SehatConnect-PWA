import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./PtSidebar";
import "./Stylesheets/PtNavbar.css";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

const PtNavbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState({}); 
  const { t } = useTranslation();

  const navigate = useNavigate();

  useEffect(() => {
    const storedProfile = JSON.parse(
      localStorage.getItem("patientProfile")
    );
    if (storedProfile) {
      setProfile(storedProfile);
    }
  }, []);

  const ptId = profile?._id;

  const handleLogoClick = () => {
    if (ptId) navigate(`/patient/${ptId}`);
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

        <div className="navbar-lang">
    <LanguageSwitcher />
  </div>

        <div className="navbar-right">
          
          <a
            onClick={() => {
              if (ptId) navigate(`/patient/${ptId}/profile`);
            }}
          >
            {t("profile")}
          </a>

          <a
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              localStorage.removeItem("patientProfile");
              navigate("/login");
            }}
          >
            {t("logout")}
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

export default PtNavbar;