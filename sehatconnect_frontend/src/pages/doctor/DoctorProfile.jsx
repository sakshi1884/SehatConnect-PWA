import React, { useEffect, useState } from "react";
import axios from "axios";
import DNavbar from "./DNavbar";
import "./Stylesheets/DoctorProfile.css";
import FlashMessage from "../../components/FlashMessage";

export default function DoctorProfile() {
  const [profile, setProfile] = useState({});
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    photo: null,
    newPassword: "",
  });

  const [preview, setPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  // 🔥 FLASH STATE
  const [flash, setFlash] = useState({ message: "", type: "" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/doctors/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = res.data.doctor;

        setProfile(data);

        setFormData({
          fullName: data.fullName || "",
          phone: data.phone || "",
          photo: null,
          newPassword: "",
        });

        setPreview(
          data.photo?.startsWith("http")
            ? data.photo
            : `http://localhost:5000/${data.photo}`
        );
      } catch (err) {
        setFlash({ message: "Failed to load profile ❌", type: "error" });
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      const file = files[0];
      setFormData({ ...formData, photo: file });
      if (file) setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("phone", formData.phone);

      if (formData.photo) data.append("photo", formData.photo);
      if (formData.newPassword)
        data.append("password", formData.newPassword);

      const res = await axios.put(
        "http://localhost:5000/api/doctors/profile",
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedDoctor = res.data.doctor;

      setProfile(updatedDoctor);
      setPreview(
        updatedDoctor.photo?.startsWith("http")
          ? updatedDoctor.photo
          : `http://localhost:5000/${updatedDoctor.photo}`
      );

      setIsEditing(false);

      setFlash({
        message: "Profile updated successfully ✅",
        type: "success",
      });

    } catch (err) {
      setFlash({
        message: "Update failed ❌",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <DNavbar />

      <div className="profile-container">
        <h2>Doctor Profile</h2>

        <FlashMessage
          message={flash.message}
          type={flash.type}
        />

        <div className="profile-photo-section">
  <div className="profile-photo">
    {preview ? (
      <img src={preview} alt="Profile" />
    ) : (
      <div className="placeholder">👨‍⚕️</div>
    )}
  </div>

  {isEditing && (
    <input type="file" name="photo" onChange={handleChange} />
  )}
</div>

        <div className="profile-form">
          <label>Full Name</label>
          <input
            name="fullName"
            value={formData.fullName}
            disabled={!isEditing}
            onChange={handleChange}
          />

          <label>Email</label>
          <input value={profile.email || ""} disabled />

          <label>Phone</label>
          <input
            name="phone"
            value={formData.phone}
            disabled={!isEditing}
            onChange={handleChange}
          />

          {isEditing && (
            <>
              <label>New Password</label>

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                />

                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
            </>
          )}

          <div className="profile-buttons">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            ) : (
              <>
                <button onClick={handleUpdate} disabled={loading}>
                  {loading ? "Updating..." : "Save Changes"}
                </button>

                <button onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .password-wrapper {
          position: relative;
        }

        .password-wrapper input {
          width: 100%;
          padding-right: 40px;
        }

        .eye-icon {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}