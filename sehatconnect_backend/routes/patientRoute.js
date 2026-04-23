import express from "express";
import upload from "../middleware/upload.js";
import {
  registerPatient,
  patientLogin,
  getAllPatients,
  getPatientsByHW,
  deletePatient,
  updatePatientProfile
} from "../controllers/patientController.js";
import Patient from "../models/Patient.js";
import protectHW from "../middleware/authMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= REGISTER =================
router.post(
  "/register",
  protectHW,
  upload.single("photo"),
  registerPatient
);

// ================= LOGIN =================
router.post("/login", patientLogin);

// ================= GET COUNT =================
router.get("/count", async (req, res) => {
  try {
    const count = await Patient.countDocuments();

    res.json({
      success: true,
      count,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ================= GET ALL PATIENTS =================
router.get("/", protectHW, getAllPatients);

// ================= GET MY PATIENTS =================
router.get("/my-patients", protectHW, getPatientsByHW);

// 
router.put(
  "/profile",
  authMiddleware, 
  upload.single("photo"),
  updatePatientProfile
);
// 


router.get("/:id", protectHW, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .select("-password") // remove password
      .populate("addedBy", "fullName"); // optional

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.json({
      success: true,
      patient,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});



// ================= UPDATE =================
router.put("/:id", protectHW, async (req, res) => {
  try {
    const updated = await Patient.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        profileCompleted: true, 
      },
      { new: true }
    );

    res.json({
      success: true,
      patient: updated,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ================= DELETE =================
router.delete("/:id", protectHW, deletePatient);



export default router;