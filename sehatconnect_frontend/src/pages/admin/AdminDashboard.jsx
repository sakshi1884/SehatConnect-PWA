import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StyleSheets/AdminDashboard.css";
import Navbar from "../../components/PNavbar";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [doctorCount, setDoctorCount] = useState(0);
  const [healthworkerCount, setHealthworkerCount] = useState(0);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      console.log("Fetching counts...");

      const doctorRes = await fetch("http://localhost:5000/api/doctors/count");
      const healthRes = await fetch("http://localhost:5000/api/healthworkers/count");

      console.log("Doctor API Status:", doctorRes.status);
      console.log("Health API Status:", healthRes.status);

      const doctorData = await doctorRes.json();
      const healthData = await healthRes.json();

      console.log("Doctor Data:", doctorData);
      console.log("Healthworker Data:", healthData);

      setDoctorCount(doctorData.count);
      setHealthworkerCount(healthData.count);
    } catch (err) {
      console.error("❌ Failed to fetch counts", err);
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />

      {/* ✅ ONLY CHANGE: layout wrapper */}
      <div className="main-layout">
        
        {/* If you add sidebar later, it goes here */}
        {/* <div className="sidebar"></div> */}

        <div className="admin-dashboard">
          <h2>Dashboard</h2>
          <p className="location">Location: Primary HealthCare Kolhapur</p>

          <div className="dashboard-cards">
            <div className="dashboard-card">
              <span className="card-title">Doctors</span>
              <h1>{doctorCount}</h1>
              <button
                className="secondary-btn"
                onClick={() => navigate("/admin/:id/alldoctors")} // ✅ unchanged
              >
                All Doctors
              </button>
            </div>

            <div className="dashboard-card">
              <span className="card-title">Healthworkers</span>
              <h1>{healthworkerCount}</h1>
              <button
                className="secondary-btn"
                onClick={() => navigate("/admin/:id/allhealthworkers")} 
              >
                All Healthworkers
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;