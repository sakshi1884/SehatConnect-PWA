import "./Stylesheets/PtHistory.css";
import PtNavbar from "./PtNavbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PtHistory() {
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [checkups, setCheckups] = useState([]);

  // ✅ get logged-in patient
  const stored = JSON.parse(localStorage.getItem("patientData"));
  const patientData = stored?.patient || stored;
  const pid = patientData?._id;

  useEffect(() => {
    if (patientData) {
      setPatient(patientData);
      loadCheckups(patientData._id);
    }
  }, []);

  // ================= LOAD CHECKUPS =================
  const loadCheckups = (id) => {
    const allCheckups =
      JSON.parse(localStorage.getItem("checkups")) || {};

    const patientCheckups = allCheckups[id] || [];

    const sorted = [...patientCheckups].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    setCheckups(sorted);
  };

  return (
    <div>
      <PtNavbar userEmail={patient?.email} role="patient" />

      <div className="details-container">

        {/* 🔙 BACK */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {/* HEADER */}
        <div className="details-header">
          <div>
            <h2>{patient?.fullName || "Patient"}</h2>
            <p>Email: {patient?.email || "—"}</p>
          </div>

          
        </div>

        {/* CHECKUPS */}
        <div className="checkup-section">
          {checkups.length === 0 ? (
            <p className="no-data">No Checkup details available</p>
          ) : (
            checkups.map((c, index) => (
              <div key={index} className="checkup-card">
                
                {/* HEADER */}
                <div className="checkup-header">
                  <span>
                    📅 {new Date(c.date).toLocaleDateString()}
                  </span>

                  <div className="right-header">
                    <span className="hw-mini">
                      👩‍⚕️ {c.healthWorkerName || "Unknown"}
                    </span>

                    <span
                      className={
                        c.temperature > 99
                          ? "risk high"
                          : "risk normal"
                      }
                    >
                      {c.temperature > 99
                        ? "Moderate Risk"
                        : "Normal"}
                    </span>
                  </div>
                </div>

                {/* REMARK */}
                <p>{c.remarks || "Routine checkup"}</p>

                {/* METRICS */}
                <div className="checkup-metrics">
                  <span>🌡 Temp: {c.temperature}°F</span>
                  <span>❤️ HR: {c.heartRate} bpm</span>
                  <span>
                    🩺 BP: {c.systolic}/{c.diastolic}
                  </span>
                  <span>🫁 O2: {c.spo2}%</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}