import "./Stylesheets/PtDashboard.css";
import PtNavbar from "./PtNavbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PtDashboard() {
  const navigate = useNavigate();

  const [patient, setPatient] = useState({});
  const [checkups, setCheckups] = useState([]);
  const [latest, setLatest] = useState(null);

  // ✅ logged-in patient
  const stored = JSON.parse(localStorage.getItem("patientData"));
  const patientData = stored?.patient || stored;
  const pid = patientData?._id;

  useEffect(() => {
    if (patientData) {
      setPatient(patientData);
      fetchCheckups(pid);
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

      // ✅ sort oldest → latest
      const sorted = data.checkups.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      setCheckups(sorted);

      // ✅ FIXED: pick latest correctly
      setLatest(sorted[sorted.length - 1]);

    } catch (err) {
      console.error("Checkup fetch error:", err);
    }
  };

  const getAge = (dob) => {
    if (!dob) return "-";
    return new Date().getFullYear() - new Date(dob).getFullYear();
  };

  const getColor = (type, value) => {
    if (!value) return "neutral";

    if (type === "temp") {
      if (value > 100) return "high";
      if (value > 99) return "moderate";
      return "normal";
    }

    if (type === "spo2") {
      return value < 95 ? "high" : "normal";
    }

    if (type === "hr") {
      return value > 100 ? "moderate" : "normal";
    }

    return "normal";
  };

  return (
    <div>
      <PtNavbar userEmail={patient.email} role="patient" />

      <div className="dashboard-container">

        {/* HEADER */}
        <div className="dashboard-header">
          <div>
            <h2>{patient.fullName}</h2>
            <p>Age: {getAge(patient.dob)}</p>
          </div>

          <div className="header-actions">
            <button onClick={() => navigate("/patient/history")}>
              History
            </button>

            <button onClick={() => navigate("/patient/profile")}>
              Profile
            </button>
          </div>
        </div>

        {/* METRICS */}
        {latest && (
          <div className="metrics-grid">

            <div className={`card ${getColor("temp", latest.temperature)}`}>
              <p>Temperature</p>
              <h3>{latest.temperature}°F</h3>
            </div>

            <div className={`card ${getColor("hr", latest.heartRate)}`}>
              <p>Heart Rate</p>
              <h3>{latest.heartRate} bpm</h3>
            </div>

            <div className="card normal">
              <p>Blood Pressure</p>
              <h3>{latest.systolic}/{latest.diastolic}</h3>
            </div>

            <div className={`card ${getColor("spo2", latest.spo2)}`}>
              <p>SpO₂</p>
              <h3>{latest.spo2}%</h3>
            </div>

            <div className="card normal">
              <p>BMI</p>
              <h3>{latest.bmi?.toFixed(1)}</h3>
            </div>

            {/* ✅ NEW METRICS */}
            <div className="card normal">
              <p>Respiratory Rate</p>
              <h3>{latest.respiratoryRate}</h3>
            </div>

            <div className="card normal">
              <p>Pulse Pressure</p>
              <h3>{latest.pulsePressure}</h3>
            </div>

            <div className="card normal">
              <p>MAP</p>
              <h3>{latest.map?.toFixed(1)}</h3>
            </div>

            <div className="card normal">
              <p>HRV</p>
              <h3>{latest.hrv || "-"}</h3>
            </div>

            {/* ✅ AI CARD (NOW FROM DB) */}
            <div className={`card ${
              latest.riskLevel === "High"
                ? "high"
                : latest.riskLevel === "Moderate"
                ? "moderate"
                : "normal"
            }`}>
              <p>Overall Health (AI)</p>
              <h3>{latest.riskLevel || "Pending"}</h3>
            </div>

          </div>
        )}

        {/* CHART */}
        {checkups.length > 0 && (
          <div className="chart-box">
            <h4>Heart Rate Trend</h4>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={checkups}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="heartRate" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

      </div>
    </div>
  );
}