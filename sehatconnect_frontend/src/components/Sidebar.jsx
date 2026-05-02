import React, { useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Sidebar.css";
import defaultAvatar from "../assets/images/admin.jpeg";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { profile, setProfile } = useContext(AuthContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/admin/profile");

        //console.log("✅ Sidebar API response:", res.data);

        // ✅ FIX: extract admin object only
        const adminData = res.data.admin || res.data;

        setProfile(adminData);

        // ✅ keep sidebar synced after refresh
        localStorage.setItem(
          "adminData",
          JSON.stringify({ admin: adminData })
        );
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [setProfile]);

  const avatar = profile?.profilePic
    ? profile.profilePic.startsWith("http")
      ? profile.profilePic
      : `https://sehatconnect-pwa-4.onrender.com/${profile.profilePic}`
    : defaultAvatar;

  const name = profile?.name || profile?.fullName || "Admin";

  const phone =
    profile?.phone ||
    profile?.phoneNumber ||
    profile?.mobile ||
    "Not Available";

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <img src={avatar} alt="Admin Avatar" className="sidebar-avatar" />

        <p className="sidebar-name">{name}</p>
        <p className="sidebar-phone">{phone}</p>

        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <ul className="sidebar-menu">
        <li onClick={() => navigate(`/admin/${id}/dashboard`)}>
          Dashboard
        </li>
        <li onClick={() => navigate(`/admin/${id}/alldoctors`)}>
          All Doctors
        </li>
        <li onClick={() => navigate(`/admin/${id}/allhealthworkers`)}>
          All Healthworkers
        </li>
        <li onClick={() => navigate(`/admin/${id}/addDoctor`)}>
          Add Doctor
        </li>
        <li onClick={() => navigate(`/admin/${id}/addHealthworker`)}>
          Add Healthworker
        </li>
       
        <li onClick={() => navigate(`/admin/${id}/healthcamps`)}>
          Health Camps
        </li>
        <li onClick={() => navigate(`/admin/${id}/profile`)}>
          Profile
        </li>

        <li
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("adminData");
            navigate("/login");
          }}
        >
          Log out
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;