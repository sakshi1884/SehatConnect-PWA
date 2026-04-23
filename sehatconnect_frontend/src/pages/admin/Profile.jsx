import React, { useState, useEffect } from "react";
import Navbar from "../../components/PNavbar";
import API from "../../services/api";
import FlashMessage from "../../components/FlashMessage";
import "./StyleSheets/Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ FLASH STATE
  const [flash, setFlash] = useState({ message: "", type: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/admin/profile");

        const adminData = res.data.admin || res.data;

        setProfile(adminData);

        localStorage.setItem(
          "adminData",
          JSON.stringify({ admin: adminData })
        );
      } catch (err) {
        console.error("PROFILE FETCH ERROR:", err);
        setError("Failed to fetch profile");

        setFlash({
          message: "Failed to fetch profile ❌",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading profile...</h2>;
  }

  if (error) {
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  }

  if (!profile) {
    return (
      <div>
        <Navbar />
        <h2 style={{ textAlign: "center", marginTop: "100px" }}>
          No profile data found
        </h2>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({
          ...prev,
          profilePic: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", profile.name || "");
      formData.append("email", profile.email || "");
      formData.append("phone", profile.phone || "");

      if (imageFile) {
        formData.append("profilePic", imageFile);
      }

      const res = await API.put("/admin/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedAdmin = res.data.admin || res.data;

      setProfile(updatedAdmin);

      localStorage.setItem(
        "adminData",
        JSON.stringify({ admin: updatedAdmin })
      );

      setFlash({
        message: "Profile updated successfully ✅",
        type: "success",
      });
    } catch (err) {
      console.error("SAVE ERROR:", err.response?.data || err.message);

      setFlash({
        message: "Profile update failed ❌",
        type: "error",
      });
    }
  };

  return (
    <div className="profile-container">
      <Navbar />

      <div className="content">
        <h2>Admin Profile</h2>

        {/* 🔥 FLASH MESSAGE */}
        <FlashMessage message={flash.message} type={flash.type} />

        <div className="profile-card">
          <div className="profile-img-section">
            <img
              src={profile.profilePic || "/default-avatar.png"}
              alt="Profile"
              className="profile-img"
            />

            <label className="file-label">
              Upload Profile Picture
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <div className="profile-details">
            <div className="form-group">
              <label>Full Name</label>
              <input
                name="name"
                value={profile.name || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input name="email" value={profile.email || ""} readOnly />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                name="phone"
                value={profile.phone || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <input value="Admin" readOnly />
            </div>

            <button className="save-btn" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;