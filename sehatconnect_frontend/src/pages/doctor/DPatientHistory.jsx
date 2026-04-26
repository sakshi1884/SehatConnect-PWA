import "./Stylesheets/PatientHistory.css";
import DNavbar from "./DNavbar";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DPatientHistory() {
  const navigate = useNavigate();
  const { id, pid } = useParams();

  const [patient, setPatient] = useState(null);
  const [checkups, setCheckups] = useState([]);

  useEffect(() => {
    fetchPatient();
    loadCheckups();
  }, [pid]);


  const fetchPatient = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://sehatconnect-pwa-4.onrender.com/api/patients/${pid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setPatient(data.patient);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error("Patient fetch error:", err);
      setPatient({
        fullName: "Unknown Patient",
        email: "No Email",
      });
    }
  };

  const loadCheckups = () => {
    const allCheckups =
      JSON.parse(localStorage.getItem("checkups")) || {};

    const patientCheckups = allCheckups[pid] || [];

    const sorted = [...patientCheckups].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    setCheckups(sorted);
  };

  return (
    <div>
      <DNavbar />

      <div className="details-container">
        {/* 🔙 BACK */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {/* ✅ HEADER */}
        <div className="details-header">
          <div>
            <h2>{patient?.fullName || "Unknown Patient"}</h2>
            <p>Email: {patient?.email || "—"}</p>
          </div>

          <div className="header-actions">
            <button
              className="action-btn green"
              onClick={() =>
                navigate(`/doctor/${id}/patient/${pid}/checkup`)
              }
            >
              🧾 New Checkup
            </button>

            <button
              className="action-btn blue"
              onClick={() =>
                navigate(`/doctor/${id}/patient/${pid}/info`)
              }
            >
              ✏️Details
            </button>
          </div>
        </div>

        {!patient?.profileCompleted && (
          <div className="no-data">
            <p>No detailed information added yet</p>
            <button
              className="action-btn blue"
              onClick={() =>
                navigate(`/doctor/${id}/patient/${pid}/detailsForm`)
              }
            >
              ➕ Add Details
            </button>
          </div>
        )}

        <div className="checkup-section">
          {checkups.length === 0 ? (
            <p className="no-data">No Checkup details added</p>
          ) : (
            checkups.map((c, index) => (
              <div key={index} className="checkup-card">
                
                {/* HEADER */}
                <div className="checkup-header">
                  <span>
                    📅 {new Date(c.date).toLocaleDateString()}
                  </span>

                  <div className="right-header">
                    {/* ✅ HEALTH WORKER */}
                    <span className="hw-mini">
                      👩‍⚕️ {c.doctorName || "Unknown"}
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
                        : "No Risk"}
                    </span>
                  </div>
                </div>

                <p>{c.remarks || "Routine checkup"}</p>

               
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