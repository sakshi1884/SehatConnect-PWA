import Checkup from "../models/checkup.js";
import { spawn } from "child_process";0
import path from "path";

// ================= ADD CHECKUP =================
export const addCheckup = async (req, res) => {
  try {
    const {
      temperature,
      heartRate,
      respiratoryRate,
      spo2,
      systolic,
      diastolic,
      weight,
      height,
      remarks,
      age,
      gender,
    } = req.body;

    // ================= DERIVED =================
    const pulsePressure = systolic - diastolic;
    const map = (systolic + 2 * diastolic) / 3;

    const bmi =
      weight && height ? weight / (height * height) : null;

    const hrv = 50; // placeholder (can improve later)

    // ================= FEATURE ARRAY FOR AI =================
    const features = [
      Number(heartRate),
      Number(respiratoryRate),
      Number(temperature),
      Number(spo2),
      Number(systolic),
      Number(diastolic),
      Number(age || 30),
      gender === "Male" ? 1 : 0,
      Number(weight),
      Number(height),
      Number(hrv),
      Number(pulsePressure),
      Number(bmi),
      Number(map),
    ];

    // ================= CALL PYTHON MODEL =================
    const scriptPath = path.join(
      process.cwd(),
      "../AI_model/predict.py"
    );

    const python = spawn("python", [scriptPath]);

    let result = "";
    let error = "";

    python.stdin.write(JSON.stringify({ features }));
    python.stdin.end();

    python.stdout.on("data", (data) => {
      result += data.toString();
    });

    python.stderr.on("data", (data) => {
      error += data.toString();
    });

    python.on("close", async () => {
      let riskLevel = "Unknown";

      try {
        if (!error && result) {
          const parsed = JSON.parse(result);
          riskLevel = parsed.prediction; // "High Risk" / "Low Risk"
        }
      } catch (e) {
        console.log("AI Parse Error:", e);
      }

      // ================= SAVE CHECKUP =================
      const checkup = await Checkup.create({
        patientId: req.params.patientId,

        createdBy: req.user._id,
        createdByModel:
          req.user.role === "doctor" ? "Doctor" : "HealthWorker",
        name: req.user.fullName,

        // vitals
        temperature,
        heartRate,
        respiratoryRate,
        spo2,
        systolic,
        diastolic,

        // body
        weight,
        height,
        bmi,

        // derived
        pulsePressure,
        map,
        hrv,

        // notes
        remarks,

        // AI output ✅
        riskLevel,
      });

      res.status(201).json({
        success: true,
        checkup,
      });
    });

  } catch (error) {
    console.error("ADD CHECKUP ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ALL CHECKUPS FOR PATIENT =================
export const getPatientCheckups = async (req, res) => {
  try {
    const data = await Checkup.find({
      patientId: req.params.patientId,
    }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: data.length,
      checkups: data,
    });

  } catch (error) {
    console.error("GET CHECKUPS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET SINGLE CHECKUP =================
export const getSingleCheckup = async (req, res) => {
  try {
    const checkup = await Checkup.findById(req.params.id);

    if (!checkup) {
      return res.status(404).json({
        success: false,
        message: "Checkup not found",
      });
    }

    res.json({
      success: true,
      checkup,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE CHECKUP =================
export const updateCheckup = async (req, res) => {
  try {
    const updated = await Checkup.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      checkup: updated,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DELETE CHECKUP =================
export const deleteCheckup = async (req, res) => {
  try {
    await Checkup.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Checkup deleted",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};