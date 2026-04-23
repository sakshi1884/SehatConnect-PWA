import React, { useEffect, useState } from "react";
import "./StyleSheets/AllHealthworkers.css";
import { Trash2, Mail } from "lucide-react";
import Navbar from "../../components/PNavbar";
import FlashMessage from "../../components/FlashMessage";

const AllHealthworkers = () => {
  const [healthworkers, setHealthworkers] = useState([]);

  // ✅ flash state
  const [flash, setFlash] = useState({ message: "", type: "" });

  useEffect(() => {
    fetchHealthworkers();
  }, []);

  // ✅ auto hide flash
  useEffect(() => {
    if (flash.message) {
      const timer = setTimeout(() => {
        setFlash({ message: "", type: "" });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [flash]);

  /* ✅ FETCH ALL */
  const fetchHealthworkers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/healthworkers");
      const data = await res.json();
      setHealthworkers(data);
    } catch (err) {
      console.error("Failed to fetch healthworkers", err);
      setFlash({ message: "Failed to load healthworkers ❌", type: "error" });
    }
  };

  /* ✅ SEND MAIL */
  const handleSendMail = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/healthworkers/send-credentials/${id}`,
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

  /* ✅ DELETE */
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this healthworker?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/healthworkers/${id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Delete failed");

      setHealthworkers((prev) =>
        prev.filter((hw) => hw._id !== id)
      );

      setFlash({
        message: "Healthworker deleted successfully 🗑️",
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
    <div className="allhealthworkers-container">
      <Navbar />

      <div className="content">

        {/* ✅ FLASH MESSAGE */}
        <FlashMessage message={flash.message} type={flash.type} />

        <h1>Manage Healthworkers</h1>
        <p className="location">Primary HealthCare Center</p>

        <div className="healthworker-grid">
          {healthworkers.map((hw) => (
            <div className="healthworker-card" key={hw._id}>
              
              {/* DELETE */}
              <button
                className="delete-icon-btn"
                onClick={() => handleDelete(hw._id)}
                title="Delete Healthworker"
              >
                <Trash2 size={18} />
              </button>

              <img
                src={hw.profilePhoto || "https://i.pravatar.cc/150"}
                alt={hw.fullName}
                className="healthworker-img"
              />

              <div className="healthworker-info">
                <h3>{hw.fullName}</h3>
                <p>{hw.role}</p>
                <p>Email: {hw.email}</p>
                <p>📞 {hw.phone}</p>
              </div>

              {/* MAIL */}
              <div className="card-actions">
                <button
                  className="mail-icon-btn"
                  onClick={() => handleSendMail(hw._id)}
                  title="Send Credentials"
                >
                  <Mail size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {healthworkers.length === 0 && (
          <p style={{ textAlign: "center" }}>
            No healthworkers found
          </p>
        )}
      </div>
    </div>
  );
};

export default AllHealthworkers;