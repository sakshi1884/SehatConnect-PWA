import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2 } from "lucide-react";
import HNavbar from "./HNavbar";
import FlashMessage from "../../components/FlashMessage";
import "./Stylesheets/AllPatients.css";

export default function AllPatients() {
  const navigate = useNavigate();
  const { id: hwId } = useParams();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FLASH STATE
  const [flash, setFlash] = useState({ message: "", type: "" });
useEffect(() => {
  if (flash.message) {
    const timer = setTimeout(() => {
      setFlash({ message: "", type: "" });
    }, 3000);

    return () => clearTimeout(timer);
  }
}, [flash.message]);
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("https://sehatconnect-pwa-4.onrender.com/api/patients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setPatients(data.patients || []);
      } else {
        setFlash({
          message: data.message || "Failed to fetch patients",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      setFlash({
        message: "Error fetching patients ❌",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDashboard = (pid) => {
    navigate(`/healthworker/${hwId}/patient/${pid}/dashboard`);
  };

  const handleDetails = (pid) => {
    navigate(`/healthworker/${hwId}/patient/${pid}/history`);
  };

  const handleDelete = async (pid) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://sehatconnect-pwa-4.onrender.com/api/patients/${pid}`,
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
      <HNavbar />

      <div className="all-patients-container">
        <div className="patients-header">
          <h2>All Patients</h2>
          <p className="location">
            Location: Primary HealthCare Kolhapur
          </p>
        </div>

        {/* 🔥 FLASH MESSAGE */}
        <FlashMessage
          message={flash.message}
          type={flash.type}
        />

        {loading ? (
          <p>Loading patients...</p>
        ) : patients.length === 0 ? (
          <p>No patients found</p>
        ) : (
          <div className="patients-grid">
            {patients.map((p) => (
              <div key={p._id} className="patient-card">

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(p._id)}
                >
                  <Trash2 size={20} />
                </button>

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

                <div className="patient-info">
                  <h3>{p.fullName}</h3>
                  <p>Email: {p.email || "—"}</p>
                  <p>Mobile: {p.phone || "—"}</p>
                  <p>
                    Added By: {p.addedBy?.fullName || "-"}
                  </p>
                </div>

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