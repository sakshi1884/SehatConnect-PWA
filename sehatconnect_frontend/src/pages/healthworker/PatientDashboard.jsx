import "./Stylesheets/PatientDashboard.css";
import HNavbar from "./HNavbar";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PatientDashboard() {
  const { id, pid } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState({});
  const [checkups, setCheckups] = useState([]);
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    fetchPatient();
    loadCheckups();
  }, [pid]);

  const fetchPatient = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://sehatconnect-pwa-4.onrender.com/api/patients/${pid}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      if (res.ok) setPatient(data.patient);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCheckups = () => {
    const all = JSON.parse(localStorage.getItem("checkups")) || {};
    const arr = all[pid] || [];

    const sorted = [...arr].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    setCheckups(sorted);
    setLatest(sorted[sorted.length - 1]);
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
      <HNavbar />

      <div className="dashboard-container">

        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="dashboard-header">
          <div>
            <h2>{patient.fullName}</h2>
            <p>Age: {getAge(patient.dob)}</p>
          </div>

          <div className="header-actions">
            <button onClick={() =>
              navigate(`/healthworker/${id}/patient/${pid}/history`)
            }>History</button>

            <button onClick={() =>
              navigate(`/healthworker/${id}/patient/${pid}/checkup`)
            }>New Checkup</button>

            <button onClick={() =>
              navigate(`/healthworker/${id}/patient/${pid}/detailsForm`)
            }>Edit</button>
          </div>
        </div>

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
              <h3>{latest.bmi}</h3>
            </div>

          </div>
        )}

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