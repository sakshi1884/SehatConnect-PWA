import { useState, useEffect } from "react";
import Navbar from "../../components/PNavbar";
import FlashMessage from "../../components/FlashMessage";
import "./StyleSheets/AdminHealthCamps.css";
import { Trash2, Pencil, Mail } from "lucide-react";

export default function AdminHealthCamps() {
  const [camp, setCamp] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    description: "",
  });

  const [allCamps, setAllCamps] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ flash state
  const [flash, setFlash] = useState({ message: "", type: "" });

  useEffect(() => {
    fetchAllCamps();
  }, []);

  useEffect(() => {
  if (flash.message) {
    const timer = setTimeout(() => {
      setFlash({ message: "", type: "" });
    }, 3000);

    return () => clearTimeout(timer);
  }
}, [flash.message]);

  /* ================= FETCH ================= */
  const fetchAllCamps = async () => {
    try {
      const res = await fetch("https://sehatconnect-pwa-4.onrender.com/api/healthcamps");
      if (!res.ok) throw new Error("Failed to fetch camps");

      const data = await res.json();
      setAllCamps(data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setFlash({ message: "Failed to load camps ❌", type: "error" });
    }
  };

  /* ================= FORM ================= */
  const handleChange = (e) => {
    setCamp({ ...camp, [e.target.name]: e.target.value });
  };

  /* ================= ADD / UPDATE ================= */
  const handleAddCamp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;

      if (editId) {
        res = await fetch(
          `https://sehatconnect-pwa-4.onrender.com/api/healthcamps/${editId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(camp),
          }
        );
      } else {
        res = await fetch("https://sehatconnect-pwa-4.onrender.com/api/healthcamps", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(camp),
        });
      }

      if (!res.ok) throw new Error("Something went wrong");

      const data = await res.json();

      if (editId) {
        setAllCamps((prev) =>
          prev.map((c) => (c._id === editId ? data : c))
        );
        setFlash({ message: "Camp updated successfully ✅", type: "success" });
      } else {
        setAllCamps((prev) => [...prev, data]);
        setFlash({ message: "Health Camp scheduled successfully ✅", type: "success" });
      }

      setCamp({
        name: "",
        date: "",
        time: "",
        location: "",
        description: "",
      });

      setEditId(null);
    } catch (err) {
      console.error("SAVE ERROR:", err);
      setFlash({ message: "Operation failed ❌", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this camp?")) return;

    try {
      const res = await fetch(
        `https://sehatconnect-pwa-4.onrender.com/api/healthcamps/${id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Delete failed");

      setAllCamps((prev) => prev.filter((c) => c._id !== id));
      setFlash({ message: "Camp deleted successfully 🗑️", type: "success" });
    } catch (err) {
      console.error("DELETE ERROR:", err);
      setFlash({ message: "Delete failed ❌", type: "error" });
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (c) => {
    const isCompleted = new Date(c.date) < new Date();

    if (isCompleted) {
      setFlash({
        message: "Completed camps cannot be edited ❌",
        type: "error",
      });
      return;
    }

    setCamp({
      name: c.name,
      date: c.date?.split("T")[0],
      time: c.time,
      location: c.location,
      description: c.description,
    });

    setEditId(c._id);
  };

  /* ================= REMINDER ================= */
  // const handleSendReminder = async (camp) => {
  //   try {
  //     const res = await fetch(
  //       `https://sehatconnect-pwa-4.onrender.com/api/healthcamps/send-reminder/${camp._id}`,
  //       { method: "POST" }
  //     );

  //     const data = await res.json();

  //     setFlash({
  //       message: data.message || "Reminder sent 📧",
  //       type: "success",
  //     });
  //   } catch (err) {
  //     console.error("REMINDER ERROR:", err);
  //     setFlash({ message: "Failed to send reminder ❌", type: "error" });
  //   }
  // };

  /* ================= SPLIT ================= */
  const upcomingCamps = allCamps.filter(
    (c) => new Date(c.date) >= new Date()
  );

  const completedCamps = allCamps.filter(
    (c) => new Date(c.date) < new Date()
  );

  return (
    <div>
      <Navbar />

      <div className="admin-healthcamp-container">

        {/* ✅ FLASH COMPONENT */}
        <FlashMessage message={flash.message} type={flash.type} />

        <h2>📅 {editId ? "Edit Health Camp" : "Schedule New Health Camp"}</h2>

        <form className="healthcamp-form" onSubmit={handleAddCamp}>
          <input name="name" value={camp.name} onChange={handleChange} placeholder="Camp Name" required />
          <input type="date" name="date" value={camp.date} onChange={handleChange} required />
          <input type="time" name="time" value={camp.time} onChange={handleChange} required />
          <input name="location" value={camp.location} onChange={handleChange} placeholder="Location" required />
          <textarea name="description" value={camp.description} onChange={handleChange} placeholder="Description" required />

          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : editId ? "Update Camp" : "+ Add Camp"}
          </button>
        </form>

        {/* UPCOMING */}
        <h3>🟢 Upcoming Camps</h3>
        <div className="camp-list">
          {upcomingCamps.map((c) => (
            <div key={c._id} className="camp-card">
              <h4>{c.name}</h4>
              <p>{new Date(c.date).toLocaleDateString()}</p>
              <p>{c.time}</p>
              <p>{c.location}</p>

              <div className="camp-actions">
                <button className="icon-btn edit" onClick={() => handleEdit(c)}>
                  <Pencil size={18} />
                </button>

                <button className="icon-btn delete" onClick={() => handleDelete(c._id)}>
                  <Trash2 size={18} />
                </button>

                {/* <button className="icon-btn mail" onClick={() => handleSendReminder(c)}>
                  <Mail size={18} />
                </button> */}
              </div>
            </div>
          ))}
        </div>

        {/* COMPLETED */}
        <h3>🔴 Completed Camps</h3>
        <div className="camp-list">
          {completedCamps.map((c) => (
            <div key={c._id} className="camp-card">
              <h4>{c.name}</h4>
              <p>{new Date(c.date).toLocaleDateString()}</p>
              <p>{c.time}</p>
              <p>{c.location}</p>

              <div className="camp-actions">
                <button className="icon-btn delete" onClick={() => handleDelete(c._id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}