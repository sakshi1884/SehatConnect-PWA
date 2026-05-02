import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./StyleSheets/AdminDashboard.css";
import Navbar from "../../components/PNavbar";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ needed for navigation

  const [doctorCount, setDoctorCount] = useState(0);
  const [healthworkerCount, setHealthworkerCount] = useState(0);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      console.log("Fetching counts...");

      const doctorRes = await fetch(
        "https://sehatconnect-pwa-4.onrender.com/api/doctors/count"
      );

      const healthRes = await fetch(
        "https://sehatconnect-pwa-4.onrender.com/api/healthworkers/count" // ✅ FIXED
      );

      console.log("Doctor API Status:", doctorRes.status);
      console.log("Health API Status:", healthRes.status);

      if (!doctorRes.ok || !healthRes.ok) {
        throw new Error("API request failed");
      }

      const doctorData = await doctorRes.json();
      const healthData = await healthRes.json();

      console.log("Doctor Data:", doctorData);
      console.log("Healthworker Data:", healthData);

      // ✅ Flexible handling (in case backend structure differs)
      setDoctorCount(doctorData.count ?? doctorData ?? 0);
      setHealthworkerCount(healthData.count ?? healthData ?? 0);

    } catch (err) {
      console.error("❌ Failed to fetch counts", err);
      setDoctorCount(0);
      setHealthworkerCount(0);
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="main-layout">
        <div className="admin-dashboard">
          <h2>Dashboard</h2>
          <p className="location">Location: Primary HealthCare Kolhapur</p>

          <div className="dashboard-cards">
            <div className="dashboard-card">
              <span className="card-title">Doctors</span>
              <h1>{doctorCount}</h1>
              <button
                className="secondary-btn"
                onClick={() => navigate(`/admin/${id}/alldoctors`)} // ✅ FIXED
              >
                All Doctors
              </button>
            </div>

            <div className="dashboard-card">
              <span className="card-title">Healthworkers</span>
              <h1>{healthworkerCount}</h1>
              <button
                className="secondary-btn"
                onClick={() => navigate(`/admin/${id}/allhealthworkers`)} 
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