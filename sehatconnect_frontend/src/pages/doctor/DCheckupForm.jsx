import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DNavbar from "./DNavbar";
import FlashMessage from "../../components/FlashMessage";
import "./Stylesheets/NewCheckupForm.css";

export default function DCheckupForm() {
  const { id, pid } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    healthWorkerName: "",
    temperature: "",
    systolic: "",
    diastolic: "",
    heartRate: "",
    respiratoryRate: "",
    spo2: "",
    bloodSugar: "",
    weight: "",
    height: "",
    remarks: "",
    otherSymptoms: "",
  });

  // ✅ FLASH STATE
  const [flash, setFlash] = useState({ message: "", type: "" });

  useEffect(() => {
    const doc = JSON.parse(localStorage.getItem("doctorProfile"));

    if (doc) {
      setForm((prev) => ({
        ...prev,
        healthWorkerName: doc.name || doc.fullName || "",
      }));
    }
  }, []);

  // ✅ AUTO HIDE FLASH
  useEffect(() => {
    if (flash.message) {
      const timer = setTimeout(() => {
        setFlash({ message: "", type: "" });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [flash]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculateBMI = () => {
    const { weight, height } = form;
    if (weight && height) {
      return (weight / ((height / 100) ** 2)).toFixed(1);
    }
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      const newRecord = {
        ...form,
        bmi: calculateBMI(),
        date: new Date().toISOString().split("T")[0],
      };

      const allCheckups =
        JSON.parse(localStorage.getItem("checkups")) || {};

      const patientCheckups = allCheckups[pid] || [];

      patientCheckups.push(newRecord);

      allCheckups[pid] = patientCheckups;

      localStorage.setItem("checkups", JSON.stringify(allCheckups));

      setFlash({
        message: "New checkup saved successfully ✅",
        type: "success",
      });

      // delay navigation so user sees message
      setTimeout(() => {
        navigate(`/doctor/${id}/patient/${pid}/history`);
      }, 800);
    } catch (err) {
      console.error(err);

      setFlash({
        message: "Failed to save checkup ❌",
        type: "error",
      });
    }
  };

  return (
    <div>
      <DNavbar />

      <div className="add-patient-container">

        {/* 🔥 FLASH MESSAGE */}
        <FlashMessage message={flash.message} type={flash.type} />

        <div className="header-row">
          <button onClick={() => navigate(-1)} className="back-btn">
            ← Back
          </button>
          <h2>Monthly Health Checkup</h2>
        </div>

        <form className="add-patient-form" onSubmit={handleSubmit}>
          
          <label>Added By:</label>
          <input
            name="healthWorkerName"
            value={form.healthWorkerName}
            readOnly
          />

          <label>Body Temperature (°F):</label>
          <input
            name="temperature"
            type="number"
            value={form.temperature}
            onChange={handleChange}
            required
          />

          <label>Systolic BP (mmHg):</label>
          <input
            name="systolic"
            type="number"
            value={form.systolic}
            onChange={handleChange}
            required
          />

          <label>Diastolic BP (mmHg):</label>
          <input
            name="diastolic"
            type="number"
            value={form.diastolic}
            onChange={handleChange}
            required
          />

          <label>Heart Rate (bpm):</label>
          <input
            name="heartRate"
            type="number"
            value={form.heartRate}
            onChange={handleChange}
            required
          />

          <label>Respiratory Rate (breaths/min):</label>
          <input
            name="respiratoryRate"
            type="number"
            value={form.respiratoryRate}
            onChange={handleChange}
            required
          />

          <label>Oxygen Saturation (SpO₂ %):</label>
          <input
            name="spo2"
            type="number"
            value={form.spo2}
            onChange={handleChange}
            required
          />

          <label>Blood Sugar (mg/dL):</label>
          <input
            name="bloodSugar"
            type="number"
            value={form.bloodSugar}
            onChange={handleChange}
          />

          <label>Weight (kg):</label>
          <input
            name="weight"
            type="number"
            value={form.weight}
            onChange={handleChange}
            required
          />

          <label>Height (cm):</label>
          <input
            name="height"
            type="number"
            value={form.height}
            onChange={handleChange}
            required
          />

          <p>
            BMI (auto-calculated): <strong>{calculateBMI()}</strong>
          </p>

          <label>Other Symptoms:</label>
          <textarea
            name="otherSymptoms"
            value={form.otherSymptoms}
            onChange={handleChange}
          />

          <label>Remarks:</label>
          <textarea
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
          />

          <button type="submit" className="next-btn">
            Save Checkup
          </button>
        </form>
      </div>
    </div>
  );
}