import express from "express";
import { spawn } from "child_process";

import Checkup from "../models/checkup.js";
import Patient from "../models/patient.js";

const router = express.Router();

router.get("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;

    // 🔥 Get patient
    const patient = await Patient.findById(pid);

    if (!patient) {
      return res.status(404).json({
        error: "Patient not found"
      });
    }

    // 🔥 Get latest checkup
    const latestCheckup = await Checkup
      .findOne({ patientId: pid })
      .sort({ createdAt: -1 });

    if (!latestCheckup) {
      return res.status(404).json({
        error: "No checkup found"
      });
    }

    // 🔥 EXACT SAME ORDER AS TRAINING
    const features = [
      Number(latestCheckup.heartRate || 0),
      Number(latestCheckup.respiratoryRate || 0),
      Number(latestCheckup.temperature || 0),
      Number(latestCheckup.spo2 || 0),

      Number(latestCheckup.systolic || 0),
      Number(latestCheckup.diastolic || 0),

      Number(patient.age || 0),

      // gender encoding
      patient.gender === "Male" ? 1 : 0,

      Number(latestCheckup.weight || 0),
      Number(latestCheckup.height || 0),

      Number(latestCheckup.hrv || 0),
      Number(latestCheckup.pulsePressure || 0),

      Number(latestCheckup.bmi || 0),
      Number(latestCheckup.map || 0)
    ];

    // 🔥 Run Python model
    const python = spawn("python3", [
      "../ai_model/predict.py"
    ]);

    let output = "";

    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.stderr.on("data", (data) => {
      console.error(data.toString());
    });

    python.on("close", async () => {
      try {
        const result = JSON.parse(output);

        // Save AI result
        latestCheckup.riskLevel =
          result.prediction === 1
            ? "High"
            : "Low";

        await latestCheckup.save();

        return res.json({
          patientId: pid,

          featuresUsed: features,

          lightgbm: {
            prediction: result.prediction,
            probability: result.probability
          }
        });

      } catch (e) {
        return res.status(500).json({
          error: "Invalid Python response",
          raw: output
        });
      }
    });

    python.stdin.write(
      JSON.stringify({ features })
    );

    python.stdin.end();

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Server error"
    });
  }
});

export default router;