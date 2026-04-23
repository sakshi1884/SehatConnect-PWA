import "./Stylesheets/PtProfile.css";
import FlashMessage from "../../components/FlashMessage";
import PtNavbar from "./PtNavbar";
import { useEffect, useState } from "react";

export default function PtProfile() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    photo: null,
  });

  const [preview, setPreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Flash state
  const [flash, setFlash] = useState({ message: "", type: "" });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("patientData"));

    const patient = stored?.patient || stored;

    if (patient) {
      setForm({
        fullName: patient.fullName,
        email: patient.email,
        password: "",
        photo: null,
      });
      setPreview(patient.profilePhoto);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];

    setForm({ ...form, photo: file });

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setFlash({ message: "Please login again", type: "error" });
        return;
      }

      const formData = new FormData();
      formData.append("fullName", form.fullName);
      formData.append("email", form.email);

      if (form.password) {
        formData.append("password", form.password);
      }

      if (form.photo) {
        formData.append("photo", form.photo);
      }

      const res = await fetch(
        "http://localhost:5000/api/patients/profile",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem(
          "patientData",
          JSON.stringify(data.patient)
        );

        setFlash({
          message: "Profile updated successfully ✅",
          type: "success",
        });
      } else {
        setFlash({
          message: data.message || "Update failed",
          type: "error",
        });
      }

    } catch (err) {
      console.error("FETCH ERROR:", err);
      setFlash({ message: "Something went wrong", type: "error" });
    }
  };

  return (
    <div>
      <PtNavbar />

      <div className="profile-container">
        <form className="profile-card" onSubmit={handleSubmit}>
          
          {/* ✅ Reusable Flash Component */}
          <FlashMessage flash={flash} setFlash={setFlash} />

          <h2>Edit Profile</h2>

          {/* PHOTO */}
          <div className="photo-section">
            <img src={preview} alt="preview" />
            <input type="file" onChange={handlePhoto} />
          </div>

          {/* NAME */}
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full Name"
          />

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
          />

          {/* PASSWORD */}
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="New Password"
              style={{
                width: "100%",
                padding: "10px 40px 10px 10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                outline: "none",
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

          <button type="submit">Update Profile</button>
        </form>
      </div>
    </div>
  );
}