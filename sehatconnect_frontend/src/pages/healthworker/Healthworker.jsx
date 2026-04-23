import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./Stylesheets/Healthworker.css";
import heroImg from "../../assets/images/hero.png";
import HNavbar from "./HNavbar"; 
import HealthworkerSidebar from "./HealthworkerSidebar";

const Healthworker = () => {
  const navigate = useNavigate(); 
  const [hwData, setHwData] = useState({
    _id: "",
    fullName: "",
    gender: "",
    email: ""
  });

  useEffect(() => {
  const stored = JSON.parse(localStorage.getItem("hwData"));
  if (stored?.healthworker) {
    setHwData({
      _id: stored.healthworker._id,
      fullName: stored.healthworker.fullName,
      gender: stored.healthworker.gender || "F",
      email: stored.healthworker.email,
    });
  }
}, []);


  return (
    <div className="healthworker-dashboard">
      <HNavbar userEmail={hwData.email} role="healthworker" />

      <div className="healthworker-body">
        <HealthworkerSidebar />

        <div className="healthworker-main">
          <div className="healthworker-content">
            <div className="healthworker-left">
              <h1 className="welcome-text">
                Welcome {hwData.gender === "M" ? "Mr." : "Ms."} {hwData.fullName}
              </h1>

              <p className="healthworker-tagline">
                Streamline patient care, organize health camps, and manage records all in one powerful platform designed for healthcare professionals.
              </p>

              <div className="healthworker-buttons">
                <button
                  className="btn-primary"
                  onClick={() => navigate(`/healthworker/${hwData._id}/addpatient`)}
                >
                  Add Patient
                </button>
                <button
                  className="btn-primary"
                  onClick={() => navigate(`/healthworker/${hwData._id}/healthcamps`)}
                >
                  Healthcamps
                </button>
              </div>
            </div>

            <div className="healthworker-right">
              <img src={heroImg} alt="Healthworker illustration" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Healthworker;
