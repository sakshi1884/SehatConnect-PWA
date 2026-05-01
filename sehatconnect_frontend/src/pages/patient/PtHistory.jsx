import "./Stylesheets/PtHistory.css";
import PtNavbar from "./PtNavbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PtHistory() {
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [checkups, setCheckups] = useState([]);

  // ✅ logged-in patient
  const stored = JSON.parse(localStorage.getItem("patientData"));
  const patientData = stored?.patient || stored;
  const pid = patientData?._id;

  useEffect(() => {
    if (patientData) {
      setPatient(patientData);
      fetchCheckups(pid); // ✅ FIXED
    }
  }, []);

  // ================= FETCH CHECKUPS =================
  const fetchCheckups = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://sehatconnect-pwa-4.onrender.com/api/checkups/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      const sorted = data.checkups.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setCheckups(sorted);

    } catch (err) {
      console.error("Checkup fetch error:", err);
    }
  };

  return (
    <div>
      <PtNavbar userEmail={patient?.email} role="patient" />

      <div className="details-container">

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

                    {/* ✅ CREATED BY */}
                    <span className="hw-mini">
                      👩‍⚕️ {c.name || "Unknown"}
                    </span>

                    {/* ✅ AI RISK */}
                    <span
                      className={`risk ${
                        c.riskLevel === "High"
                          ? "high"
                          : c.riskLevel === "Moderate"
                          ? "moderate"
                          : "normal"
                      }`}
                    >
                      {c.riskLevel || "Pending"}
                    </span>

                  </div>
                </div>

                {/* REMARK */}
                <p>{c.remarks || "Routine checkup"}</p>

                {/* METRICS */}
                <div className="checkup-metrics">
                  <span>🌡 Temp: {c.temperature}°F</span>
                  <span>❤️ HR: {c.heartRate} bpm</span>
                  <span>🩺 BP: {c.systolic}/{c.diastolic}</span>
                  <span>🫁 O2: {c.spo2}%</span>
                  <span>🫁 RR: {c.respiratoryRate}</span>
                  <span>⚖ BMI: {c.bmi?.toFixed(1)}</span>
                  <span>📊 MAP: {c.map?.toFixed(1)}</span>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}