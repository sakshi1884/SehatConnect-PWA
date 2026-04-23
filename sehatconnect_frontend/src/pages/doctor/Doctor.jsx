import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Stylesheets/Doctor.css";
import heroImg from "../../assets/images/hero.png";
import DNavbar from "./DNavbar";
import DoctorSidebar from "./DoctorSidebar";

const Doctor = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("Doctor");
  const [gender, setGender] = useState("");

  useEffect(() => {
    try {
      const storedData = JSON.parse(localStorage.getItem("doctorData"));

      if (storedData?.doctor) {
        const fullName = storedData.doctor.fullName || "Doctor";

        // Remove extra "Dr." if already present
        const cleanName = fullName.replace(/^Dr\.\s*/i, "");

        setName(cleanName);
        setGender(storedData.doctor.gender || "");
      }
    } catch (err) {
      console.error("Error reading doctor data:", err);
    }
  }, []);

  return (
    <div className="doctor-dashboard">
      <DNavbar userEmail={localStorage.getItem("userEmail")} role="doctor" />

      <div className="doctor-body">
        <DoctorSidebar />

        <div className="doctor-main">
          <div className="doctor-content">
            <div className="doctor-left">
              <h1 className="welcome-text">
                Welcome Dr. {name}
              </h1>

              <p className="doctor-tagline">
                Access patient records, view monthly reports, monitor risk
                predictions and deliver better healthcare with smart insights.
              </p>

              <div className="doctor-buttons">
                <button
                  className="btn-primary"
                  onClick={() => navigate("/doctor/patients")}
                >
                  All Patients
                </button>

                <button
                  className="btn-primary"
                  onClick={() => navigate("/doctor/camps")}
                >
                  Health Camps
                </button>
              </div>
            </div>

            <div className="doctor-right">
              <img src={heroImg} alt="Doctor illustration" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctor;
