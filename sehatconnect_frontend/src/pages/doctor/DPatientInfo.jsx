import "./Stylesheets/PatientInfo.css";
import DNavbar from "./DNavbar";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DPatientInfo() {
  const { id, pid } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);

  useEffect(() => {
    fetchPatient();
  }, [pid]);

  const fetchPatient = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/patients/${pid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setPatient(data.patient);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!patient) {
    return <h3 style={{ textAlign: "center" }}>Loading...</h3>;
  }

  return (
    <div>
      <DNavbar />

      <div className="info-container">
        {/* BACK */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {/* CARD */}
        <div className="info-card">
          <h2>{patient.fullName}</h2>
          <p><strong>Email:</strong> {patient.email}</p>
          <p><strong>Phone:</strong> {patient.phone}</p>
          <p><strong>Gender:</strong> {patient.gender || "-"}</p>
          <p><strong>Age:</strong> {patient.age || "-"}</p>
          <p><strong>Village:</strong> {patient.village || "-"}</p>
          <p><strong>Address:</strong> {patient.address || "-"}</p>
          <p><strong>Occupation:</strong> {patient.occupation || "-"}</p>
          <p><strong>Medical History:</strong> {patient.pastMedicalConditions || "-"}</p>


          <button
            className="edit-btn"
            onClick={() =>
              navigate(`/doctor/${id}/patient/${pid}/detailsForm`)
            }
          >
            ✏️ Edit Details
          </button>
        </div>
      </div>
    </div>
  );
}