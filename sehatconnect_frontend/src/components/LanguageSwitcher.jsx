import { useState } from "react";
import { Globe } from "lucide-react";
import i18n from "i18next";

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    setOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      {/* 🌐 Icon */}
      <Globe
        size={22}
        style={{ cursor: "pointer", color: "#ffffff" }}
        onClick={() => setOpen(!open)}
      />

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute",
          top: "30px",
          right: "0",
          background: "white",
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          padding: "5px 0",
          minWidth: "120px",
          zIndex: 1000
        }}>
          <div onClick={() => changeLang("en")} style={itemStyle}>English</div>
          <div onClick={() => changeLang("hi")} style={itemStyle}>हिंदी</div>
          <div onClick={() => changeLang("mr")} style={itemStyle}>मराठी</div>
          <div onClick={() => changeLang("ta")} style={itemStyle}>தமிழ்</div>
        </div>
      )}
    </div>
  );
}

const itemStyle = {
  padding: "8px 12px",
  cursor: "pointer"
};