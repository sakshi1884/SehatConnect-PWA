import React, { useEffect, useState } from "react";
import "./StyleSheets/AllDoctor.css";
import { Trash2, Mail } from "lucide-react";
import Navbar from "../../components/PNavbar";
import FlashMessage from "../../components/FlashMessage";

const AllDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [flash, setFlash] = useState({ message: "", type: "" });

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
  if (flash.message) {
    const timer = setTimeout(() => {
      setFlash({ message: "", type: "" });
    }, 3000);

    return () => clearTimeout(timer);
  }
}, [flash.message]);

  const fetchDoctors = async () => {
    try {
      const res = await fetch("https://sehatconnect-pwa-4.onrender.com/api/doctors");
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      console.error("Failed to fetch doctors", err);
      setFlash({ message: "Failed to load doctors ❌", type: "error" });
    }
  };

  const handleSendMail = async (id) => {
    try {
      const res = await fetch(
        `https://sehatconnect-pwa-4.onrender.com/api/doctors/send-credentials/${id}`,
        { method: "POST" }
      );

      const data = await res.json();

      setFlash({
        message: data.message || "Credentials sent successfully ✅",
        type: "success",
      });
    } catch (err) {
      console.log("EMAIL ERROR FULL:", err);
      setFlash({
        message: "Failed to send credentials mail ❌",
        type: "error",
      });
    }
  };


  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this doctor?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(
        `https://sehatconnect-pwa-4.onrender.com/api/doctors/${id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Delete failed");

      setDoctors((prev) => prev.filter((doc) => doc._id !== id));

      setFlash({
        message: "Doctor deleted successfully 🗑️",
        type: "success",
      });
    } catch (err) {
      console.error("Delete failed", err);
      setFlash({
        message: "Delete failed ❌",
        type: "error",
      });
    }
  };

  return (
    <div className="alldoctors-container">
      <Navbar />

      <div className="content">

        <FlashMessage message={flash.message} type={flash.type} />

        <h1>Manage Doctors</h1>
        <p className="location">Primary HealthCare Center</p>

        <div className="doctor-grid">
          {doctors.map((doctor) => (
            <div className="doctor-card" key={doctor._id}>

           
              <button
                className="delete-icon-btn"
                onClick={() => handleDelete(doctor._id)}
                title="Delete Doctor"
              >
                <Trash2 size={18} />
              </button>

              <img
                src={doctor.photo || "/default-doctor.png"}
                alt={doctor.fullName}
                className="doctor-img"
              />

              <div className="doctor-info">
                <h3>{doctor.fullName}</h3>
                <p className="spec">{doctor.specialization}</p>
                <p className="exp">Email: {doctor.email}</p>
                <p className="phone">📞 {doctor.phone}</p>
              </div>

              <div className="card-actions">
                <button
                  className="mail-icon-btn"
                  onClick={() => handleSendMail(doctor._id)}
                  title="Send Credentials"
                >
                  <Mail size={18} />
                </button>
              </div>

            </div>
          ))}
        </div>

        {doctors.length === 0 && (
          <p style={{ textAlign: "center" }}>No doctors found</p>
        )}
      </div>
    </div>
  );
};

export default AllDoctors;