import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { useTranslation } from "react-i18next";
import "./Stylesheets/Patient.css";
import heroImg from "../../assets/images/heroo.png";
import PtNavbar from "./PtNavbar"; 
import PtSidebar from "./PtSidebar";

const Patient = () => {
  const navigate = useNavigate(); 
  const { t } = useTranslation();

  const [ptData, setPtData] = useState({
    _id: "",
    fullName: "",
    gender: "",
    email: ""
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("patientData"));

    if (stored?.patient) {
      setPtData({
        _id: stored.patient._id,
        fullName: stored.patient.fullName,
        gender: stored.patient.gender,
        email: stored.patient.email,
      });
    }
  }, []);

  return (
    <div className="patient-dashboard">
      <PtNavbar userEmail={ptData.email} role="patient" />

      <div className="patient-body">
        <PtSidebar />

        <div className="patient-main">
          <div className="patient-content">
            <div className="patient-left">

              <h1 className="welcome-text">
                {t("welcome")} {ptData.fullName}
              </h1>

              <p className="patient-tagline">
                {t("patient_tagline")}
              </p>

              <div className="patient-buttons">
                <button
                  className="btn-primary"
                  onClick={() => navigate(`/patient/${ptData._id}/dashboard`)}
                >
                  {t("dashboard")}
                </button>

                <button
                  className="btn-primary"
                  onClick={() => navigate(`/patient/${ptData._id}/history`)}
                >
                  {t("history")}
                </button>
              </div>

            </div>

            <div className="patient-right">
              <img src={heroImg} alt="Patient illustration" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Patient;