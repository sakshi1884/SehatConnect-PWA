import { useEffect, useState } from "react";
import axios from "axios";
import DNavbar from "./DNavbar";
import "./Stylesheets/HealthCamp.css";

export default function DHealthCamp() {
  const [upcomingCamps, setUpcomingCamps] = useState([]);
  const [pastCamps, setPastCamps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthCamps();
  }, []);

  const fetchHealthCamps = async () => {
  try {
    const res = await axios.get(
      "https://sehatconnect-pwa-4.onrender.com/api/healthcamps"
    );

    console.log("API HEALTH CAMPS:", res.data);

    const camps = Array.isArray(res.data)
      ? res.data
      : res.data.camps || [];

    console.log("CAMPS ARRAY:", camps);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = camps.filter((camp) => {
      const campDate = new Date(camp.date);
      campDate.setHours(0, 0, 0, 0);
      return campDate >= today;
    });

    const past = camps.filter((camp) => {
      const campDate = new Date(camp.date);
      campDate.setHours(0, 0, 0, 0);
      return campDate < today;
    });

    setUpcomingCamps(upcoming);
    setPastCamps(past);
  } catch (error) {
    console.error("Error fetching camps:", error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      <DNavbar />
      <div className="healthcamp-container">
        <div className="camp-header">
          <h2>🏥 Health Camps</h2>
          <p className="location">Location: Primary HealthCare Kolhapur</p>
        </div>

        {loading ? (
          <p>Loading health camps...</p>
        ) : (
          <>
            <section className="camp-section">
              <h3 className="section-title">🟢 Upcoming Health Camps</h3>
              {upcomingCamps.length === 0 ? (
                <p className="no-camps">No upcoming camps scheduled.</p>
              ) : (
                <div className="camp-grid">
                  {upcomingCamps.map((camp) => (
                    <div key={camp._id} className="camp-card">
                      <div className="status-tag upcoming">Upcoming</div>
                      <h3>{camp.name}</h3>
                      <p><strong>Date:</strong> {new Date(camp.date).toLocaleDateString("en-IN")}</p>
                      <p><strong>Time:</strong> {camp.time}</p>
                      <p><strong>Location:</strong> {camp.location}</p>
                      <p className="camp-desc">{camp.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Past */}
            <section className="camp-section">
              <h3 className="section-title">🔴 Past Health Camps</h3>
              {pastCamps.length === 0 ? (
                <p className="no-camps">No past camps found.</p>
              ) : (
                <div className="camp-grid">
                  {pastCamps.map((camp) => (
                    <div key={camp._id} className="camp-card">
                      <div className="status-tag past">Completed</div>
                      <h3>{camp.name}</h3>
                      <p><strong>Date:</strong> {new Date(camp.date).toLocaleDateString("en-IN")}</p>
                      <p><strong>Time:</strong> {camp.time}</p>
                      <p><strong>Location:</strong> {camp.location}</p>
                      <p className="camp-desc">{camp.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}