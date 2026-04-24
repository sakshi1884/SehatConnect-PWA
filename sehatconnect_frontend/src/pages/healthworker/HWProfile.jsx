import React, { useState, useEffect } from "react";
import API from "../../services/api.js";
import HNavbar from "./HNavbar";
import HealthworkerSidebar from "./HealthworkerSidebar";
import FlashMessage from "../../components/FlashMessage";
import "./Stylesheets/HWProfile.css";

export default function HWProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [flash, setFlash] = useState({ message: "", type: "" });

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    healthcareCenter: "",
    location: "",
    phone: "",
    profilePhoto: "",
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  // =========================
  // FETCH PROFILE
  // =========================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/healthworkers/profile");

        setProfile({
          ...res.data,
          profilePhoto: res.data.profilePhoto || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setFlash({ message: "Failed to load profile", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // =========================
  // IMAGE UPLOAD
  // =========================
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePhoto", file);

    try {
      const res = await API.put(
        "/healthworkers/profile/image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setProfile((prev) => ({
        ...prev,
        profilePhoto: res.data.profilePhoto,
      }));

      setFlash({ message: "Image updated successfully", type: "success" });
    } catch (err) {
      console.error(err);
      setFlash({ message: "Image upload failed", type: "error" });
    }
  };

  // =========================
  // SAVE PROFILE
  // =========================
  const handleSave = async () => {
    try {
      await API.put("/healthworkers/profile", profile);
      setIsEditing(false);

      setFlash({
        message: "Profile updated successfully!",
        type: "success",
      });
    } catch (err) {
      console.error(err);
      setFlash({
        message: "Failed to update profile",
        type: "error",
      });
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // CHANGE PASSWORD
  // =========================
  const handleChangePassword = async () => {
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      setFlash({ message: "Please fill both fields!", type: "error" });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setFlash({ message: "Passwords do not match!", type: "error" });
      return;
    }

    try {
      await API.put("/healthworkers/change-password", {
        newPassword: passwordData.newPassword.trim(),
        confirmPassword: passwordData.confirmPassword.trim(),
      });

      setFlash({
        message: "Password updated successfully!",
        type: "success",
      });

      setPasswordData({
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("PASSWORD ERROR:", err.response?.data || err);

      setFlash({
        message:
          err.response?.data?.message || "Password update failed",
        type: "error",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div>
      <HNavbar />

      {/* ✅ FLASH MESSAGE */}
      <FlashMessage flash={flash} setFlash={setFlash} />

      <div className="hw-layout">
        <HealthworkerSidebar />

        <div className="hw-profile-container">
          <div className="hw-profile-card">

            {/* PHOTO */}
            <div className="profile-photo-section">
              {profile.profilePhoto ? (
                <img
                  src={
                    profile.profilePhoto.startsWith("http")
                      ? profile.profilePhoto
                      : `http://localhost:5000/${profile.profilePhoto}`
                  }
                  alt="Profile"
                  className="profile-photo"
                />
              ) : (
                <div className="photo-placeholder">📷</div>
              )}

              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              )}
            </div>

            {/* DETAILS */}
            <div className="profile-details">
              {isEditing ? (
                <>
                  <input name="name" value={profile.name} onChange={handleChange} />
                  <input name="email" value={profile.email} onChange={handleChange} />
                  <input name="healthcareCenter" value={profile.healthcareCenter} onChange={handleChange} />
                  <input name="location" value={profile.location} onChange={handleChange} />
                  <input name="phone" value={profile.phone} onChange={handleChange} />

                  <button onClick={handleSave}>Save Changes</button>
                </>
              ) : (
                <>
                  <h2>{profile.name}</h2>
                  <p>{profile.email}</p>
                  <p>{profile.healthcareCenter}</p>
                  <p>{profile.phone}</p>

                  <button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </button>
                </>
              )}
            </div>

            <hr />

            {/* PASSWORD */}
            <div className="password-form">
              <h3>Change Password</h3>

              <div className="password-input-wrapper">
                <input
                  type={showPassword.newPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="New Password"
                />
              </div>

              <div className="password-input-wrapper">
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm Password"
                />
              </div>

              <button onClick={handleChangePassword}>
                Update Password
              </button>
            </div>

            <button onClick={handleLogout}>Logout</button>

          </div>
        </div>
      </div>
    </div>
  );
}