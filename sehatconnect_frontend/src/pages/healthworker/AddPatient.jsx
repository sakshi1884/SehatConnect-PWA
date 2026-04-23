import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HNavbar from "./HNavbar";
import FlashMessage from "../../components/FlashMessage";
import "./Stylesheets/AddPatient.css";

export default function AddPatient() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    photo: null,
  });

  const [addedByName, setAddedByName] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  // ✅ Flash state
  const [flash, setFlash] = useState({ message: "", type: "" });

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("healthworkerProfile"));

    if (profile?.fullName) {
      setAddedByName(profile.fullName);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      const file = files?.[0] || null;

      setFormData((prev) => ({
        ...prev,
        photo: file,
      }));

      if (file) {
        setPreview(URL.createObjectURL(file));
      } else {
        setPreview(null);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setFlash({
          message: "Session expired. Please login again",
          type: "error",
        });
        navigate("/login");
        return;
      }

      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("password", formData.password);

      if (formData.photo) {
        data.append("photo", formData.photo);
      }

      await axios.post(
        "http://localhost:5000/api/patients/register",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFlash({
        message: "Patient registered successfully ✅",
        type: "success",
      });

      // ⏳ slight delay so user can see message
      setTimeout(() => {
        const hwProfile = JSON.parse(
          localStorage.getItem("healthworkerProfile")
        );

        navigate(`/healthworker/${hwProfile._id}/allpatients`);
      }, 1500);

    } catch (error) {
      console.error("PATIENT REGISTER ERROR:", error);

      setFlash({
        message:
          error.response?.data?.message ||
          "Patient registration failed ❌",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <HNavbar />

      <div className="add-patient-container">
        <h2>Add Patient</h2>
        <p className="location">Location: Primary HealthCare Kolhapur</p>

        <form className="add-patient-form" onSubmit={handleSubmit}>
          
          {/* ✅ Flash Message */}
          <FlashMessage flash={flash} setFlash={setFlash} />

          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            pattern="[6-9]{1}[0-9]{9}"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          {/* 🔥 PASSWORD WITH EYE TOGGLE */}
          <label>Password</label>
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px 40px 10px 10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "18px",
                color: "#555",
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <label>Profile Photo</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="preview-img"
            />
          )}

          <label>Added By</label>
          <input type="text" value={addedByName} disabled />

          <button type="submit" className="next-btn" disabled={loading}>
            {loading ? "Saving..." : "SAVE"}
          </button>
        </form>
      </div>
    </div>
  );
}