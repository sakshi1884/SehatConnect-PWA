import React, { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid
} from "recharts";

import {
  useNavigate
} from "react-router-dom";

import {
  Trophy,
  Activity,
  Clock3,
  ShieldAlert,
  ShieldCheck
} from "lucide-react";

import "./Stylesheets/ModelAnalysis.css";

const COLORS = [
  "#6C63FF",
  "#00C9A7",
  "#FFB547",
  "#FF6B81",
  "#4D96FF",
  "#A66CFF"
];

const ModelComparison = () => {

  const navigate = useNavigate();

  const [results, setResults] = useState();

  useEffect(() => {

    const storedResults =
      localStorage.getItem("modelResults");

    if (storedResults) {

      setResults(JSON.parse(storedResults));

    }

  }, []);

  if (!results) {

    return (

      <div className="no-result">

        No Results Found

      </div>

    );

  }

  const chartData =
    Object.entries(results).map(
      ([model, data]) => ({

        model,

        accuracy: data.accuracy,

        f1: data.f1_score

      })
    );

  const pieData = [
    {
      name: "High Risk",
      value: Object.values(results).filter(
        (r) => r.prediction === "High Risk"
      ).length
    },
    {
      name: "Low Risk",
      value: Object.values(results).filter(
        (r) => r.prediction === "Low Risk"
      ).length
    }
  ];

  return (
    <div className="model-analysis-container">

    <div className="top-section">

  <div className="title-section">

    <button
      className="back-btn"
      onClick={() => navigate(-1)}
    >

      ← Back

    </button>

    <div>

      <h1 className="model-analysis-title">

        AI Model Analytics Dashboard

      </h1>

     <p
  className="subtitle"
  style={{ marginLeft: "100px",marginTop:"13px"}}
>

  Interactive comparison of machine learning models

</p>

    </div>

  </div>

</div>

      <div className="model-grid">

        {Object.entries(results).map(
          ([model, data], index) => (

            <div
              className="model-card"
              key={model}
            >

              <div className="card-glow"></div>

              <div className="model-top">

                <div className="model-icon">

                  <Trophy size={22} />

                </div>

                <h2>{model}</h2>

              </div>

              <div className="metric">

                <Activity size={18} />

                <span>

                  Accuracy

                </span>

                <strong>

                  {data.accuracy}%

                </strong>

              </div>

              <div className="progress-bar">

                <div
                  className="progress-fill accuracy-fill"
                  style={{
                    width: `${data.accuracy}%`
                  }}
                ></div>

              </div>

              <div className="metric">

                <ShieldCheck size={18} />

                <span>

                  F1 Score

                </span>

                <strong>

                  {data.f1_score}%

                </strong>

              </div>

              <div className="progress-bar">

                <div
                  className="progress-fill f1-fill"
                  style={{
                    width: `${data.f1_score}%`
                  }}
                ></div>

              </div>

              <div className="metric">

                <Clock3 size={18} />

                <span>

                  Execution

                </span>

                <strong>

                  {data.execution_time}s

                </strong>

              </div>

              <div className="prediction-box">

                {
                  data.prediction ===
                  "High Risk"

                    ? <ShieldAlert size={20} />

                    : <ShieldCheck size={20} />
                }

                <span
                  className={
                    data.prediction ===
                    "High Risk"

                      ? "high-risk"

                      : "low-risk"
                  }
                >

                  {data.prediction}

                </span>

              </div>

            </div>

          )
        )}

      </div>

      <div className="charts-grid">

        <div className="chart-container">

          <div className="chart-header">

            <h2>

              Accuracy & F1 Comparison

            </h2>

          </div>

          <ResponsiveContainer
            width="100%"
            height={380}
          >

            <BarChart
              data={chartData}
              barGap={10}
            >

              <defs>

                <linearGradient
                  id="accuracyGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >

                  <stop
                    offset="0%"
                    stopColor="#6C63FF"
                  />

                  <stop
                    offset="100%"
                    stopColor="#4D96FF"
                  />

                </linearGradient>

                <linearGradient
                  id="f1Gradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >

                  <stop
                    offset="0%"
                    stopColor="#00C9A7"
                  />

                  <stop
                    offset="100%"
                    stopColor="#00E4FF"
                  />

                </linearGradient>

              </defs>

              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="model"
                tick={{
                  fill: "#555"
                }}
              />

              <YAxis />

              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow:
                    "0 8px 20px rgba(0,0,0,0.12)"
                }}
              />

              <Legend />

              <Bar
                dataKey="accuracy"
                fill="url(#accuracyGradient)"
                radius={[12, 12, 0, 0]}
              />

              <Bar
                dataKey="f1"
                fill="url(#f1Gradient)"
                radius={[12, 12, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        <div className="chart-container">

          <div className="chart-header">

            <h2>

              Risk Prediction Distribution

            </h2>

          </div>

          <ResponsiveContainer
            width="100%"
            height={380}
          >

            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={140}
                innerRadius={70}
                paddingAngle={6}
                label
              >

                {pieData.map(
                  (entry, index) => (

                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                          COLORS.length
                        ]
                      }
                    />

                  )
                )}

              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>

  );

};

export default ModelComparison;