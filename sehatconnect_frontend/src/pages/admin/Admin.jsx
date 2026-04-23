import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./StyleSheets/Admin.css";
import Navbar from "../../components/PNavbar";
import heroImg from "../../assets/images/hero.png";
import AllDoctors from "./AllDoctors";
import AllHealthworkers from "./AllHealthworkers";
import API from "../../services/api";

const Admin = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [currentView, setCurrentView] = useState("dashboard");
  const [profile, setProfile] = useState(null);

  //Fetch logged-in admin profile
  useEffect(() => {
  const fetchAdminProfile = async () => {
    try {
      const res = await API.get("/admin/profile");

      console.log("PROFILE RESPONSE:", res.data);

      const adminData = res.data.admin || res.data;

      setProfile(adminData);
    } catch (err) {
      console.error("Error fetching admin profile:", err);
    }
  };

  fetchAdminProfile();
}, []);

  const renderContent = () => {
    switch (currentView) {
      case "doctors":
        return <AllDoctors />;

      case "healthworkers":
        return <AllHealthworkers />;

      default:
        return (
          <div className="admin-content">
            <h1>Welcome, {profile?.name || "Admin"}!</h1>
            <p>Manage Doctors and Healthworkers easily!</p>

            <div className="admin-buttons">
              <button
                className="btn-primary"
                onClick={() => navigate(`/admin/${id}/addDoctor`)}
              >
                Add Doctor
              </button>

              <button
                className="btn-primary"
                onClick={() => navigate(`/admin/${id}/addHealthworker`)}
              >
                Add Healthworker
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="admin-dashboard">
      {/*Pass profile to Navbar */}
      <Navbar profile={profile} />

      <div className="admin-main">
        <div className="admin-content-wrapper">
          <div className="admin-left">{renderContent()}</div>

          {currentView === "dashboard" && (
            <div className="admin-right">
              <img src={heroImg} alt="Admin Illustration" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
