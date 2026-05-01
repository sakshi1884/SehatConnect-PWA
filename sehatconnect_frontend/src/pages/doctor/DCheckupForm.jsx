import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DNavbar from "./DNavbar";
import FlashMessage from "../../components/FlashMessage";
import "./Stylesheets/NewCheckupForm.css";

export default function DCheckupForm() {
  const { id, pid } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    temperature: "",
    systolic: "",
    diastolic: "",
    heartRate: "",
    respiratoryRate: "",
    spo2: "",
    bloodSugar: "",
    weight: "",
    height: "", // in cm (UI)
    remarks: "",
    otherSymptoms: "",
  });

  const [flash, setFlash] = useState({ message: "", type: "" });

  // ✅ get doctor name
  useEffect(() => {
    const doc = JSON.parse(localStorage.getItem("doctorProfile"));

    if (doc) {
      setForm((prev) => ({
        ...prev,
        name: doc.name || doc.fullName || "",
      }));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ BMI
  const calculateBMI = () => {
    const { weight, height } = form;
    if (weight && height) {
      return (weight / ((height / 100) ** 2)).toFixed(1);
    }
    return "";
  };

  // ✅ DERIVED
  const calculateDerived = () => {
    const sys = Number(form.systolic);
    const dia = Number(form.diastolic);

    return {
      pulsePressure: sys - dia,
      map: (sys + 2 * dia) / 3,
    };
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const derived = calculateDerived();

      const payload = {
        patientId: pid,
        createdByModel: "Doctor",
        name: form.name,

        temperature: Number(form.temperature),
        heartRate: Number(form.heartRate),
        respiratoryRate: Number(form.respiratoryRate),
        spo2: Number(form.spo2),

        systolic: Number(form.systolic),
        diastolic: Number(form.diastolic),

        weight: Number(form.weight),

        // ✅ FIX HEIGHT → meters
        height: Number(form.height) / 100,

        bmi: Number(calculateBMI()),

        pulsePressure: derived.pulsePressure,
        map: derived.map,
        hrv: 0, // placeholder

        remarks: form.remarks,
      };

      const res = await fetch(
        "https://sehatconnect-pwa-4.onrender.com/api/checkups",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setFlash({
        message: "Checkup saved successfully ✅",
        type: "success",
      });

      setTimeout(() => {
        navigate(`/doctor/${id}/patient/${pid}/history`);
      }, 1000);

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

        <FlashMessage message={flash.message} type={flash.type} />

        <div className="header-row">
          <button onClick={() => navigate(-1)} className="back-btn">
            ← Back
          </button>
          <h2>Monthly Health Checkup</h2>
        </div>

        <form className="add-patient-form" onSubmit={handleSubmit}>
          
          <label>Doctor Name:</label>
          <input name="name" value={form.name} readOnly />

          <label>Body Temperature (°F):</label>
          <input name="temperature" type="number" value={form.temperature} onChange={handleChange} required />

          <label>Systolic BP:</label>
          <input name="systolic" type="number" value={form.systolic} onChange={handleChange} required />

          <label>Diastolic BP:</label>
          <input name="diastolic" type="number" value={form.diastolic} onChange={handleChange} required />

          <label>Heart Rate:</label>
          <input name="heartRate" type="number" value={form.heartRate} onChange={handleChange} required />

          <label>Respiratory Rate:</label>
          <input name="respiratoryRate" type="number" value={form.respiratoryRate} onChange={handleChange} required />

          <label>SpO₂:</label>
          <input name="spo2" type="number" value={form.spo2} onChange={handleChange} required />

          <label>Weight (kg):</label>
          <input name="weight" type="number" value={form.weight} onChange={handleChange} required />

          <label>Height (cm):</label>
          <input name="height" type="number" value={form.height} onChange={handleChange} required />

          <p>BMI: <strong>{calculateBMI()}</strong></p>

          <label>Remarks:</label>
          <textarea name="remarks" value={form.remarks} onChange={handleChange} />

          <button type="submit" className="next-btn">
            Save Checkup
          </button>
        </form>
      </div>
    </div>
  );
}