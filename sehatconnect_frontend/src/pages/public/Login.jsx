import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import API from "../../services/api";
import "./Login.css";
import logo from "../../assets/images/logo-512.png";

const Login = () => {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    if (!role) {
      alert("Please select your role!");
      setLoading(false);
      return;
    }

    try {
      let endpoint = "";

      switch (role) {
        case "admin":
          endpoint = "/admin/login";
          break;
        case "doctor":
          endpoint = "/doctors/login";
          break;
        case "healthworker":
          endpoint = "/healthworkers/login";
          break;
        case "patient":
          endpoint = "/patients/login"; 
          break;
        default:
          endpoint = "/api/auth/login";
      }

      const res = await API.post(endpoint, { email, password });

      console.log("✅ Login Response:", res.data);

      let userData;

      switch (role) {
        case "healthworker":
          userData = res.data.hw;
          break;
        case "doctor":
          userData = res.data.doctor;
          break;
        case "admin":
          userData = res.data.admin;
          break;
        case "patient":
          userData = res.data.patient;
          break;
        default:
          userData = res.data.user;
      }

      if (!userData) {
        throw new Error(res.data.message || "Login failed: no user returned");
      }

      // =========================
      // SAVE COMMON AUTH DATA
      // =========================
      localStorage.setItem("role", role);
      localStorage.setItem("token", res.data.token);

      // =========================
      // SAVE ROLE-SPECIFIC DATA
      // =========================
      if (role === "healthworker") {
        localStorage.setItem(
          "healthworkerProfile",
          JSON.stringify({
            _id: userData._id,
            fullName: userData.fullName,
            email: userData.email,
            profilePic: userData.profilePic,
            phone: userData.phone,
            role: userData.role,
          })
        );

        localStorage.setItem(
          "hwData",
          JSON.stringify({ healthworker: userData })
        );
      }

      if (role === "doctor") {
        localStorage.setItem(
          "doctorProfile",
          JSON.stringify({
            _id: userData._id,
            fullName: userData.fullName,
            email: userData.email,
            profilePic: userData.photo,
          })
        );

        localStorage.setItem(
          "doctorData",
          JSON.stringify({ doctor: userData })
        );
      }
      if (role === "patient") {
        localStorage.setItem(
          "patientProfile",
          JSON.stringify({
            _id: userData._id,
            fullName: userData.fullName,
            email: userData.email,
            profilePic: userData.photo,
          })
        );

        localStorage.setItem(
          "patientData",
          JSON.stringify({ patient: userData })
        );
      }

      if (role === "admin") {
        localStorage.setItem(
          "adminData",
          JSON.stringify({ admin: userData })
        );
      }

      

      console.log("✅ Saved to localStorage successfully");

      // =========================
      // NAVIGATE
      // =========================
      switch (role) {
        case "admin":
          navigate(`/admin/${userData._id}`);
          break;
        case "doctor":
          navigate(`/doctor/${userData._id}`);
          break;
        case "healthworker":
          navigate(`/healthworker/${userData._id}`);
          break;
        case "patient":
          navigate(`/patient/${userData._id}`);
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      alert(error.response?.data?.message || error.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back
        </button>

        <div className="login-header">
          <img src={logo} alt="SehatConnect logo" className="login-logo" />
          <h1 className="app-title">SehatConnect</h1>
        </div>

        <h2 className="login-title">LOGIN</h2>

        <form className="login-form" onSubmit={handleLogin}>
          <label>Email Id :</label>
          <input
            type="email"
            placeholder="Enter your mail ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password :</label>
          <div className="password-container" style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", paddingRight: "35px" }}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="eye-icon"
              style={{
                position: "absolute",
                right: "10px",
                top: "38%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#555",
              }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <label>Select your role :</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">-- Select your role --</option>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="healthworker">Healthworker</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;