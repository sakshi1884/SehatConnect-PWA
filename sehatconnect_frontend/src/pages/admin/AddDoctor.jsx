import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./StyleSheets/AddDoctor.css";
import Navbar from "../../components/PNavbar";
import FlashMessage from "../../components/FlashMessage";

const AddDoctor = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    specialization: "",
    qualification: "",
    experience: "",
    licenseNumber: "",
    medicalCouncil: "",
    password: "",
    photo: null,
  });

  const [preview, setPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Flash state
  const [flash, setFlash] = useState({ message: "", type: "" });

  // ✅ auto hide flash
  useEffect(() => {
    if (flash.message) {
      const timer = setTimeout(() => {
        setFlash({ message: "", type: "" });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [flash]);

  // ===== HANDLE INPUT CHANGE =====
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
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // ===== SUBMIT FORM =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("gender", formData.gender);
      data.append("dateOfBirth", formData.dateOfBirth);
      data.append("specialization", formData.specialization);
      data.append(
        "qualification",
        JSON.stringify(
          formData.qualification
            .split(",")
            .map((q) => q.trim())
            .filter(Boolean)
        )
      );
      data.append("experience", formData.experience);
      data.append("licenseNumber", formData.licenseNumber);
      data.append("medicalCouncil", formData.medicalCouncil);
      data.append("password", formData.password);

      if (formData.photo) {
        data.append("photo", formData.photo);
      }

      await axios.post(
        "http://127.0.0.1:5000/api/doctors/register",
        data
      );

      // ✅ success flash
      setFlash({
        message: "Doctor registered successfully ✅",
        type: "success",
      });

      // redirect after small delay
      setTimeout(() => {
        navigate(`/admin/alldoctors`);
      }, 1500);

    } catch (error) {
      console.error("FULL ERROR:", error);

      // ❌ error flash
      setFlash({
        message:
          error.response?.data?.message ||
          "Doctor registration failed ❌",
        type: "error",
      });
    }
  };

  return (
    <div className="doctor-page">
      <Navbar />

      <div className="doctor-form-card">
        <button
          className="back-btn"
          type="button"
          onClick={() => navigate(`/admin/${id}/alldoctors`)}
        >
          ← Back
        </button>

        <h2>Register New Doctor</h2>

        <form onSubmit={handleSubmit} autoComplete="off">

          {/* 🔥 FLASH MESSAGE */}
          <FlashMessage message={flash.message} type={flash.type} />

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
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <label>Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label>Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />

          <label>Specialization</label>
          <input
            type="text"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            required
          />

          <label>Qualification (comma separated)</label>
          <input
            type="text"
            name="qualification"
            placeholder="MBBS, MD"
            value={formData.qualification}
            onChange={handleChange}
            required
          />

          <label>Experience (Years)</label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            min="0"
          />

          <label>License Number</label>
          <input
            type="text"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            required
          />

          <label>Medical Council</label>
          <input
            type="text"
            name="medicalCouncil"
            value={formData.medicalCouncil}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ width: "100%", paddingRight: "40px" }}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#555",
              }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
              style={{
                width: "100px",
                marginTop: "10px",
                borderRadius: "8px",
              }}
            />
          )}

          <button type="submit" className="save-btn">
            SAVE
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;