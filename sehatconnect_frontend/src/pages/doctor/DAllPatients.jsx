import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2 } from "lucide-react";
import DNavbar from "./DNavbar";
import FlashMessage from "../../components/FlashMessage";
import "./Stylesheets/AllPatients.css";

export default function DAllPatients() {
  const navigate = useNavigate();
  const { id: doctorId } = useParams();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FLASH STATE
  const [flash, setFlash] = useState({ message: "", type: "" });

  useEffect(() => {
    fetchPatients();
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

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/patients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setPatients(data.patients || []);
      } else {
        throw new Error(data.message || "Failed to fetch patients");
      }
    } catch (error) {
      console.error("Error fetching patients:", error);

      setFlash({
        message: "Failed to load patients ❌",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDashboard = (pid) => {
    navigate(`/doctor/${doctorId}/patient/${pid}/dashboard`);
  };

  const handleDetails = (pid) => {
    navigate(`/doctor/${doctorId}/patient/${pid}/history`);
  };

  const handleDelete = async (pid) => {
    if (!window.confirm("Are you sure you want to delete this patient?"))
      return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/patients/${pid}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Delete failed");

      setPatients((prev) => prev.filter((p) => p._id !== pid));

      setFlash({
        message: "Patient deleted successfully ✅",
        type: "success",
      });
    } catch (error) {
      console.error("Delete error:", error);

      setFlash({
        message: error.message || "Delete failed ❌",
        type: "error",
      });
    }
  };

  return (
    <div>
      <DNavbar />

      <div className="all-patients-container">

        {/* 🔥 FLASH MESSAGE */}
        <FlashMessage message={flash.message} type={flash.type} />

        <div className="patients-header">
          <h2>All Patients</h2>
          <p className="location">Location: Primary HealthCare Kolhapur</p>
        </div>

        {loading ? (
          <p>Loading patients...</p>
        ) : patients.length === 0 ? (
          <p>No patients found</p>
        ) : (
          <div className="patients-grid">
            {patients.map((p) => (
              <div key={p._id} className="patient-card">

                {/* DELETE */}
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(p._id)}
                >
                  <Trash2 size={20} />
                </button>

                {/* PHOTO */}
                <div className="patient-photo-container">
                  {p.profilePhoto ? (
                    <img
                      src={p.profilePhoto}
                      alt={p.fullName}
                      className="patient-photo"
                    />
                  ) : (
                    <div className="patient-placeholder">👤</div>
                  )}
                </div>

                {/* INFO */}
                <div className="patient-info">
                  <h3>{p.fullName}</h3>
                  <p>Email: {p.email || "—"}</p>
                  <p>Mobile: {p.phone || "—"}</p>
                  <p>Added By: {p.addedBy?.fullName || "-"}</p>
                </div>

                {/* ACTIONS */}
                <div className="card-actions">
                  <button
                    className="dashboard-btn"
                    onClick={() => handleDashboard(p._id)}
                  >
                    📊 Dashboard
                  </button>

                  <button
                    className="details-btn"
                    onClick={() => handleDetails(p._id)}
                  >
                    📄 History
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}