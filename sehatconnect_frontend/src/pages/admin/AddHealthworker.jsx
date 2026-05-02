import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./StyleSheets/AddHealthworker.css";
import Navbar from "../../components/PNavbar";
import FlashMessage from "../../components/FlashMessage";

const AddHealthworker = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    domicileCity: "",
    password: "",
    photo: null,
  });

  const [preview, setPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // ✅ flash state
  const [flash, setFlash] = useState({ message: "", type: "" });

  // ✅ auto hide flash
 useEffect(() => {
   if (flash.message) {
     const timer = setTimeout(() => {
       setFlash({ message: "", type: "" });
     }, 3000);
 
     return () => clearTimeout(timer);
   }
 }, [flash.message]);

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
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("role", formData.role);
      data.append("domicileCity", formData.domicileCity);
      data.append("password", formData.password);

      if (formData.photo) {
        data.append("photo", formData.photo);
      }

      await axios.post(
        "https://sehatconnect-pwa-4.onrender.com/api/healthworkers/register",
        data
      );

      // ✅ success flash
      setFlash({
        message: "Healthworker added successfully ✅",
        type: "success",
      });

      setTimeout(() => {
        navigate("/admin/dashboard/allhealthworkers");
      }, 1500);

    } catch (err) {
      console.error(err);

      // ❌ error flash
      setFlash({
        message:
          err.response?.data?.message ||
          "Error adding healthworker ❌",
        type: "error",
      });
    }
  };

  return (
    <>
      <Navbar />

      <div className="healthworker-page">
        <div className="healthworker-form-card">

          <button
            className="back-btn"
            onClick={() => navigate("/admin/:id/allhealthworkers")}
          >
            ← Back
          </button>

          <h2>Add Healthworker</h2>

          <form onSubmit={handleSubmit} encType="multipart/form-data">

            {/* 🔥 FLASH MESSAGE */}
            <FlashMessage message={flash.message} type={flash.type} />

            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="e.g. Sita Patil"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <label>Email ID</label>
            <input
              type="email"
              name="email"
              placeholder="e.g. sita@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="10-digit Indian mobile number"
              pattern="[6-9]{1}[0-9]{9}"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="ANM">ANM</option>
              <option value="GNM">GNM</option>
              <option value="ASHA">ASHA</option>
              <option value="MPW">MPW</option>
            </select>

            <label>Domicile City</label>
            <input
              type="text"
              name="domicileCity"
              placeholder="e.g. Kolhapur"
              value={formData.domicileCity}
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
                className="preview-img"
              />
            )}

            <button type="submit" className="save-btn">
              SAVE
            </button>

          </form>
        </div>
      </div>
    </>
  );
};

export default AddHealthworker;