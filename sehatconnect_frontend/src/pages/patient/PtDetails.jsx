import "./Stylesheets/PtDetails.css";
import PtNavbar from "./PtNavbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function PtDetails() {
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("patientData"));
    const data = stored?.patient || stored;

    if (data) setPatient(data);
  }, []);

  if (!patient) {
    return <h3 className="loading">Loading...</h3>;
  }

  return (
    <div>
      <PtNavbar userEmail={patient.email} role="patient" />

      <div className="info-container">

        {/* BACK */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {/* PROFILE CARD */}
        <div className="info-card">

          <div className="profile-header">
            <img
              src={patient.profilePhoto}
              alt="profile"
              className="profile-img"
            />

            <div>
              <h2>{patient.fullName}</h2>
              <p className="tagline">
                {patient.occupation || "Patient"}
              </p>
            </div>
          </div>

          {/* DETAILS GRID */}
          <div className="info-grid">

            <div className="info-box">
              <span>{t("email")}</span>
              <p>{patient.email}</p>
            </div>

            <div className="info-box">
              <span>{t("phone")}</span>
              <p>{patient.phone || "-"}</p>
            </div>

            <div className="info-box">
              <span>{t("gender")}</span>
              <p>{patient.gender || "-"}</p>
            </div>

            <div className="info-box">
              <span>{t("Age")}</span>
              <p>{patient.age || "-"}</p>
            </div>

            <div className="info-box">
              <span>{t("village")}</span>
              <p>{patient.village || "-"}</p>
            </div>

            <div className="info-box">
              <span>{t("address")}</span>
              <p>{patient.address || "-"}</p>
            </div>

          </div>

          {/* MEDICAL SECTION */}
          <div className="medical-box">
            <h4>{t("medical_history")}</h4>
            <p>{patient.pastMedicalConditions || t("no_history")}</p>
          </div>

          
        </div>
      </div>
    </div>
  );
}