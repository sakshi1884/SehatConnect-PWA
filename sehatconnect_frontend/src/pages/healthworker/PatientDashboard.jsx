import "./Stylesheets/PatientDashboard.css";
import HNavbar from "./HNavbar";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  useEffect,
  useState
} from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PatientDashboard() {

  const { id, pid } = useParams();

  const navigate = useNavigate();

  const location = useLocation();

  const [patient, setPatient] = useState({});

  const [checkups, setCheckups] = useState([]);

  const [latest, setLatest] = useState(null);

  const [allResults, setAllResults] =
    useState({});

  const [lightgbmResult, setLightgbmResult] =
    useState(null);

  const [loadingAI, setLoadingAI] =
    useState(true);

  // ================= INITIAL LOAD =================
  useEffect(() => {

    fetchPatient();

    loadCheckups();

  }, [pid]);

  // ================= RECEIVE AI DATA =================
 // ================= LOAD AI RESULT FROM LATEST CHECKUP =================
useEffect(() => {

  if (!latest) return;

  console.log("LATEST CHECKUP:", latest);

  // All model results stored in MongoDB
  if (latest.modelResults) {

    setAllResults(latest.modelResults);

    if (latest.modelResults.LightGBM) {

      setLightgbmResult({
        prediction:
          latest.modelResults.LightGBM.prediction,

        accuracy:
          latest.modelResults.LightGBM.accuracy,

        f1_score:
          latest.modelResults.LightGBM.f1_score,

        execution_time:
          latest.modelResults.LightGBM.execution_time,
      });

    }

  } else {

    console.warn(
      "No modelResults found in latest checkup"
    );

  }

  setLoadingAI(false);

}, [latest]);

  // ================= PATIENT =================
  const fetchPatient = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await fetch(

        `https://sehatconnect-pwa-4.onrender.com/api/patients/${pid}`,

        {

          headers: {

            Authorization:
              `Bearer ${token}`,

          },

        }

      );

      const data = await res.json();

      if (res.ok) {

        setPatient(data.patient);

      }

    } catch (err) {

      console.error(err);

    }

  };

  // ================= CHECKUPS =================
  const loadCheckups = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await fetch(

        `https://sehatconnect-pwa-4.onrender.com/api/checkups/${pid}`,

        {

          headers: {

            Authorization:
              `Bearer ${token}`,

          },

        }

      );

      const data = await res.json();

      if (res.ok) {

        const sorted =
          data.checkups.sort(

            (a, b) =>
              new Date(a.date) -
              new Date(b.date)

          );

        setCheckups(sorted);

        if (sorted.length > 0) {

          setLatest(
            sorted[
              sorted.length - 1
            ]
          );

        }

      }

    } catch (err) {

      console.error(err);

    }

  };

  // ================= HELPERS =================
  const getRiskClass = (risk) => {

    if (
      risk === 1 ||
      risk === "High Risk" ||
      risk === "High"
    ) {

      return "high";

    }

    if (
      risk === 0 ||
      risk === "Low Risk" ||
      risk === "Low"
    ) {

      return "normal";

    }

    if (typeof risk === "string") {

      const value =
        risk.toLowerCase();

      if (
        value.includes("high")
      ) {

        return "high";

      }

      if (
        value.includes("moderate")
      ) {

        return "moderate";

      }

      if (
        value.includes("low")
      ) {

        return "normal";

      }

    }

    return "neutral";

  };

  const getRiskLabel = (prediction) => {

    if (
      prediction === 1 ||
      prediction === "1"
    ) {

      return "High Risk";

    }

    if (
      prediction === 0 ||
      prediction === "0"
    ) {

      return "Low Risk";

    }

    if (
      typeof prediction ===
      "string"
    ) {

      return prediction;

    }

    return "Unknown";

  };

  const getAge = (dob) => {

    if (!dob) return "-";

    return (

      new Date().getFullYear() -

      new Date(dob).getFullYear()

    );

  };

  const getColor = (type, value) => {

  if (value === null || value === undefined) {
    return "neutral";
  }

 if (type === "temp") {

  // Celsius ranges
  if (value >= 38) return "high";      // Fever
  if (value < 35) return "high";       // Hypothermia
  if (value >= 35 && value < 36) return "moderate"; // Slightly low
  if (value >= 36 && value < 38) return "normal";

  return "normal";
}

  if (type === "spo2") {
    return value < 95 ? "high" : "normal";
  }

  if (type === "hr") {
    return value > 100 ? "moderate" : "normal";
  }

  return "normal";
};

  // ================= UI =================
  return (

    <div>

      <HNavbar />

      <div className="dashboard-container">

        <button

          className="back-btn"

          onClick={() =>
            navigate(`/healthworker/${id}/patient/${pid}/dashboard`)
          }

        >

          ← Back

        </button>

        {/* HEADER */}
        <div className="dashboard-header">

          <div>

            <h2>
              {patient.fullName}
            </h2>

            <p>
              Age:
              {" "}
              {getAge(
                patient.dob
              )}
            </p>

          </div>

          <div className="header-actions">

            <button

              onClick={() =>
                navigate(

                  `/healthworker/${id}/patient/${pid}/history`

                )
              }

            >

              History

            </button>

            <button

              onClick={() =>
                navigate(

                  `/healthworker/${id}/patient/${pid}/checkup`

                )
              }

            >

              New Checkup

            </button>

            <button

              onClick={() =>
                navigate(

                  `/healthworker/${id}/patient/${pid}/detailsForm`

                )
              }

            >

              Edit

            </button>

          </div>

        </div>

        {/* METRICS */}
        {latest && (

          <div>

            <div className="metrics-grid">

              <div
                className={`card ${getColor(
                  "temp",
                  latest.temperature
                )}`}
              >

                <p>
                  Temperature
                </p>

                <h3>
                  {latest.temperature}°C
                </h3>

              </div>

              <div
                className={`card ${getColor(
                  "hr",
                  latest.heartRate
                )}`}
              >

                <p>
                  Heart Rate
                </p>

                <h3>
                  {latest.heartRate} bpm
                </h3>

              </div>

              <div className="card normal">

                <p>
                  Blood Pressure
                </p>

                <h3>

                  {latest.systolic}/
                  {latest.diastolic}

                </h3>

              </div>

              <div
                className={`card ${getColor(
                  "spo2",
                  latest.spo2
                )}`}
              >

                <p>
                  SpO₂
                </p>

                <h3>
                  {latest.spo2}%
                </h3>

              </div>

              <div className="card normal">

                <p>
                  BMI
                </p>

                <h3>

                  {latest.bmi?.toFixed(
                    1
                  )}

                </h3>

              </div>

              <div className="card normal">

                <p>
                  Pulse Pressure
                </p>

                <h3>
                  {latest.pulsePressure}
                </h3>

              </div>

              <div className="card normal">

                <p>
                  MAP
                </p>

                <h3>

                  {latest.map?.toFixed(
                    1
                  )}

                </h3>

              </div>

            </div>

            {/* AI SECTION */}
            <div className="ai-section">

              <div

                className={`card ai-card ${getRiskClass(

                  lightgbmResult?.prediction

                )}`}

              >

                <p>

                  Overall Health
                  (AI - LightGBM)

                </p>

                <h2>

                  {loadingAI

                    ? "Loading..."

                    : getRiskLabel(
                        lightgbmResult?.prediction
                      )}

                </h2>

                <p className="ai-subtext">

                  Accuracy:
                  {" "}

                  {lightgbmResult?.accuracy
                    ? Number(
                        lightgbmResult.accuracy
                      ).toFixed(2)
                    : "0.00"}%

                  {" | "}

                  F1 Score:
                  {" "}

                  {lightgbmResult?.f1_score
                    ? Number(
                        lightgbmResult.f1_score
                      ).toFixed(2)
                    : "0.00"}%

                </p>

                <button

                  className="analysis-btn"

                  onClick={() => {

                    navigate(

                      `/healthworker/${id}/patient/${pid}/model-analysis`,

                      {

                        state: {

                          allResults

                        }

                      }

                    );

                  }}

                >

                  View All Models

                </button>

              </div>

            </div>

          </div>

        )}

        {/* CHART */}
        {checkups.length > 0 && (

          <div className="chart-box">

            <h4>
              Heart Rate Trend
            </h4>

            <ResponsiveContainer
              width="100%"
              height={250}
            >

              <LineChart
                data={checkups}
              >

                <XAxis
                  dataKey="date"
                />

                <YAxis />

                <Tooltip />

                <Line

                  type="monotone"

                  dataKey="heartRate"

                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        )}

      </div>

    </div>

  );

}