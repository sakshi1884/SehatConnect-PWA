import React, { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./PNavbar.css";
import { AuthContext } from "../context/AuthContext";

const PNavbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // get profile from global context
  const { profile } = useContext(AuthContext);

  console.log("NAVBAR PROFILE:", profile);

  const handleLogoClick = () => {
    navigate(`/admin/${id}`);
  };

  const handleLogout = () => {
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
          <a onClick={() => navigate(`/admin/${id}/profile`)}>
            Profile
          </a>
          <a onClick={handleLogout}>
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

export default PNavbar;
