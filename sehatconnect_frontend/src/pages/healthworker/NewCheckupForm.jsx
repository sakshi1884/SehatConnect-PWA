import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import HNavbar from "./HNavbar";
import FlashMessage from "../../components/FlashMessage";

import "./Stylesheets/NewCheckupForm.css";

export default function NewCheckupForm() {

  const { id, pid } = useParams();
  const [patient, setPatient] = useState({});
  useEffect(() => {

  const fetchPatient =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const res = await fetch(

          `https://sehatconnect-pwa-4.onrender.com/api/patients/${pid}`,

          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }

        );

        const data =
          await res.json();
          console.log("PATIENT API RESPONSE:", data);

        setPatient(data.patient);

      } catch (err) {

        console.log(err);

      }

    };

  fetchPatient();

}, [pid]);

  const navigate = useNavigate();

  const [flash, setFlash] = useState({
    message: "",
    type: ""
  });

  const [form, setForm] = useState({

    healthWorkerName: "",

    temperature: "",

    systolic: "",

    diastolic: "",

    heartRate: "",

    respiratoryRate: "",

    spo2: "",

    bloodSugar: "",

    weight: "",

    height: "",

    remarks: "",

    otherSymptoms: "",

  });

  // ================= FLASH AUTO HIDE =================
  useEffect(() => {

    if (flash.message) {

      const timer = setTimeout(() => {

        setFlash({
          message: "",
          type: ""
        });

      }, 3000);

      return () => clearTimeout(timer);

    }

  }, [flash.message]);

  // ================= LOAD HEALTH WORKER =================
  useEffect(() => {

    const hw = JSON.parse(
      localStorage.getItem(
        "healthworkerProfile"
      )
    );

    if (hw) {

      setForm((prev) => ({

        ...prev,

        healthWorkerName:
          hw.name ||
          hw.fullName ||
          "",

      }));

    }

  }, []);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value

    });

  };

  // ================= BMI =================
  const calculateBMI = () => {

    const {
      weight,
      height
    } = form;

    if (weight && height) {

      return (

        Number(weight) /

        ((Number(height) / 100) ** 2)

      ).toFixed(1);

    }

    return "";

  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const token =
        localStorage.getItem(
          "token"
        );

      const heightInMeters =
        Number(form.height) / 100;

      // ================= CHECKUP PAYLOAD =================
      const payload = {

        temperature:
          Number(form.temperature),

        systolic:
          Number(form.systolic),

        diastolic:
          Number(form.diastolic),

        heartRate:
          Number(form.heartRate),

        respiratoryRate:
          Number(form.respiratoryRate),

        spo2:
          Number(form.spo2),

        weight:
          Number(form.weight),

        height:
          heightInMeters,

        bmi:
          Number(calculateBMI()),

        remarks:
          form.remarks,

        otherSymptoms:
          form.otherSymptoms,

      };

      // ================= SAVE CHECKUP =================
      const res = await fetch(

        `https://sehatconnect-pwa-4.onrender.com/api/checkups/${pid}`,

        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,

          },

          body: JSON.stringify(
            payload
          ),

        }

      );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(

          data.message ||

          "Failed to save checkup"

        );

      }

      // ================= AI PREDICTION =================
      const aiRes = await fetch(

        "https://sehatconnect-pwa-4.onrender.com/api/models/predict-all-models",

        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,

          },

          body: JSON.stringify({

  features: [

    Number(form.heartRate),

    Number(form.respiratoryRate),

    Number(form.temperature),

    Number(form.spo2),

    Number(form.systolic),

    Number(form.diastolic),

    Number(patient.age),

    patient.gender === "Male"
      ? 1
      : 0,

    Number(form.weight),

    Number(form.height),

    0.05,

    Number(form.systolic) -
    Number(form.diastolic),

    Number(calculateBMI()),

    Number(
      (
        Number(form.diastolic) +
        (
          Number(form.systolic) -
          Number(form.diastolic)
        ) / 3
      ).toFixed(1)
    )

  ]

}),

        }

      );

      const text = await aiRes.text();

console.log("RAW AI RESPONSE:", text);

let aiData;

try {

  aiData = JSON.parse(text);

} catch (err) {

  throw new Error(text);

}

      // ================= HANDLE AI ERROR =================
      if (
        aiData.error
      ) {

        throw new Error(
          aiData.error
        );

      }

      // ================= FIX MISSING PREDICTIONS =================
      Object.keys(aiData).forEach((model) => {

        if (
          !aiData[model].prediction
        ) {

          aiData[model].prediction =

            aiData[model].probability >= 0.5

              ? "High Risk"

              : "Low Risk";

        }

      });

      // ================= STORE RESULTS =================
      localStorage.setItem(

        "modelResults",

        JSON.stringify(aiData)

      );

      // ================= SUCCESS =================
      setFlash({

        message:
          "Checkup + AI Analysis Complete ✅",

        type: "success",

      });

      // ================= NAVIGATE =================
      setTimeout(() => {

        navigate(

          `/healthworker/${id}/patient/${pid}/dashboard`,

          {

            state: {

              predictionResults:
                aiData,

              lightgbmPrediction:
                aiData.LightGBM

            }

          }

        );

      }, 2000);

    } catch (error) {

      console.error(error);

      setFlash({

        message:

          error.message ||

          "Error saving checkup ❌",

        type: "error",

      });

    }

  };

  // ================= UI =================
  return (

    <div>

      <HNavbar />

      <FlashMessage

        message={flash.message}

        type={flash.type}

      />

      <div className="add-patient-container">

        <div className="header-row">

          <button

            onClick={() =>

              navigate(

                `/healthworker/${id}/patient/${pid}/dashboard`

              )

            }

            className="back-btn"

          >

            ← Back

          </button>

          <h2>
            Monthly Health Checkup
          </h2>

        </div>

        <form

          className="add-patient-form"

          onSubmit={handleSubmit}

        >

          <label>
            Health Worker Name:
          </label>

          <input

            name="healthWorkerName"

            value={
              form.healthWorkerName
            }

            readOnly

          />

          <label>
            Body Temperature (°F):
          </label>

          <input

            name="temperature"

            type="number"

            value={form.temperature}

            onChange={handleChange}

            required

          />

          <label>
            Systolic BP (mmHg):
          </label>

          <input

            name="systolic"

            type="number"

            value={form.systolic}

            onChange={handleChange}

            required

          />

          <label>
            Diastolic BP (mmHg):
          </label>

          <input

            name="diastolic"

            type="number"

            value={form.diastolic}

            onChange={handleChange}

            required

          />

          <label>
            Heart Rate (bpm):
          </label>

          <input

            name="heartRate"

            type="number"

            value={form.heartRate}

            onChange={handleChange}

            required

          />

          <label>
            Respiratory Rate (breaths/min):
          </label>

          <input

            name="respiratoryRate"

            type="number"

            value={form.respiratoryRate}

            onChange={handleChange}

            required

          />

          <label>
            Oxygen Saturation (SpO₂ %):
          </label>

          <input

            name="spo2"

            type="number"

            value={form.spo2}

            onChange={handleChange}

            required

          />

          <label>
            Blood Sugar (mg/dL):
          </label>

          <input

            name="bloodSugar"

            type="number"

            value={form.bloodSugar}

            onChange={handleChange}

          />

          <label>
            Weight (kg):
          </label>

          <input

            name="weight"

            type="number"

            value={form.weight}

            onChange={handleChange}

            required

          />

          <label>
            Height (cm):
          </label>

          <input

            name="height"

            type="number"

            value={form.height}

            onChange={handleChange}

            required

          />

          <p>

            BMI (auto-calculated):

            {" "}

            <strong>
              {calculateBMI()}
            </strong>

          </p>

          <label>
            Other Symptoms:
          </label>

          <textarea

            name="otherSymptoms"

            value={
              form.otherSymptoms
            }

            onChange={handleChange}

          />

          <label>
            General Remarks:
          </label>

          <textarea

            name="remarks"

            value={form.remarks}

            onChange={handleChange}

          />

          <button

            type="submit"

            className="next-btn"

          >

            Save Checkup

          </button>

        </form>

      </div>

    </div>

  );

}