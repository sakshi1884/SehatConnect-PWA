import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HNavbar from "./HNavbar";
import FlashMessage from "../../components/FlashMessage";
import "./Stylesheets/detailsForm.css";

export default function PatientDetails() {
  const { id, pid } = useParams();
  const navigate = useNavigate();

  const loggedInHW = JSON.parse(
    localStorage.getItem("healthworkerProfile")
  );

  const [details, setDetails] = useState({
    fullName: "",
    dob: "",
    age: "",
    gender: "",
    address: "",
    region: "",
    village: "",
    contactNumber: "",
    maritalStatus: "",
    occupation: "",
    educationLevel: "",
    addedBy: loggedInHW?.name || "",
    pastMedicalConditions: "",
    pastSurgeries: "",
    longTermMedications: "",
    allergies: "",
    familyHistory: "",
    lifestyleBasics: "",
    smokingStatus: "",
    alcoholConsumption: "",
    dietType: "",
  });

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
          const patient = data.patient;

          setDetails((prev) => ({
            ...prev,
            ...patient,
            fullName: patient.fullName || "",
            contactNumber: patient.phone || "",
          }));
        } else {
          setFlash({
            message: data.message || "Failed to load patient",
            type: "error",
          });
        }
      } catch (err) {
        console.error("Error fetching patient:", err);
        setFlash({
          message: "Error fetching patient ❌",
          type: "error",
        });
      }
    };

    fetchPatient();
  }, [pid]);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dob") {
      setDetails({
        ...details,
        dob: value,
        age: calculateAge(value),
      });
    } else {
      setDetails({ ...details, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://sehatconnect-pwa-4.onrender.com/api/patients/${pid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...details,
            profileCompleted: true,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setFlash({
        message: "Patient Details saved ✅",
        type: "success",
      });

      setTimeout(() => {
        navigate(`/healthworker/${id}/patient/${pid}/info`);
      }, 2500);

    } catch (err) {
      console.error(err);
      setFlash({
        message: "Error saving details ❌",
        type: "error",
      });
    }
  };

  return (
    <div>
      <HNavbar />

      <div
        className="patient-details-container"
        style={{ position: "relative" }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "#f1f3f5",
            border: "none",
            padding: "8px 12px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          ← Back
        </button>

        <h2 style={{ textAlign: "center", marginTop: "10px" }}>
          Patient Detailed Information
        </h2>

        {/* 🔥 FLASH */}
        <FlashMessage
          message={flash.message}
          type={flash.type}
        />

        <form className="patient-details-form" onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input value={details.fullName} readOnly />

          <label>Date of Birth</label>
          <input
            name="dob"
            type="date"
            value={details.dob || ""}
            onChange={handleChange}
            required
          />

          <label>Age</label>
          <input value={details.age || ""} readOnly />

          <label>Gender</label>
          <select
            name="gender"
            value={details.gender || ""}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option>Female</option>
            <option>Male</option>
            <option>Other</option>
          </select>

          <label>Address</label>
          <textarea
            name="address"
            value={details.address || ""}
            onChange={handleChange}
            required
          />

          <label>Village</label>
          <input
            name="village"
            value={details.village || ""}
            onChange={handleChange}
            required
          />

          <label>Contact</label>
          <input value={details.contactNumber || ""} readOnly />

          <label>Occupation</label>
          <input
            name="occupation"
            value={details.occupation || ""}
            onChange={handleChange}
            required
          />

          <label>Medical History</label>
          <textarea
            name="pastMedicalConditions"
            value={details.pastMedicalConditions || ""}
            onChange={handleChange}
          />

          <button type="submit" className="submit-btn">
            SAVE DETAILS
          </button>
        </form>
      </div>
    </div>
  );
}