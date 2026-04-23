import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Stylesheets/DoctorSidebar.css";
import defaultAvatar from "../../assets/images/healthworker.jpg";

const DoctorSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    id: "",
    name: "",
    email: "",
    profilePic: "",
  });

  const loadProfile = () => {
    const storedProfile = JSON.parse(
      localStorage.getItem("doctorProfile")
    );

    if (storedProfile) {
      setProfile({
        id: storedProfile._id || storedProfile.id || "",
        name: storedProfile.fullName || storedProfile.name || "Doctor",
        email: storedProfile.email || "",
        profilePic:
          storedProfile.profilePic ||
          storedProfile.photo ||
          "",
      });
    }
  };

  useEffect(() => {
    loadProfile();

    const handleStorageChange = () => loadProfile();
    const handleProfileUpdate = () => loadProfile();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("doctorProfile");
    navigate("/login");
  };

  const goTo = (path) => {
    if (!profile.id) {
      navigate("/login");
      return;
    }
    navigate(path);
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <img
          src={profile.profilePic || defaultAvatar}
          alt="Doctor Avatar"
          className="sidebar-avatar"
        />

        <p className="sidebar-name">{profile.name}</p>
        <p className="sidebar-email">{profile.email}</p>

        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <ul className="sidebar-menu">
        <li onClick={() => goTo(`/doctor/${profile.id}`)}>🏠 Home</li>
        <li onClick={() => goTo(`/doctor/${profile.id}/addpatient`)}>
          ➕ Add Patient
        </li>
        <li onClick={() => goTo(`/doctor/${profile.id}/allpatients`)}>
          👥 All Patients
        </li>
        <li onClick={() => goTo(`/doctor/${profile.id}/healthcamps`)}>
          🏥 Health Camps
        </li>
        <li onClick={() => goTo(`/doctor/${profile.id}/profile`)}>
          👤 Profile
        </li>
        <li onClick={handleLogout}>🚪 Logout</li>
      </ul>
    </div>
  );
};

export default DoctorSidebar;