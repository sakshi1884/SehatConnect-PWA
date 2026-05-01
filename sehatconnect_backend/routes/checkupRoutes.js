import express from "express";
import {
  addCheckup,
  getPatientCheckups,
  getSingleCheckup,
  updateCheckup,
  deleteCheckup,
} from "../controllers/checkupController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// ================= ADD CHECKUP =================
// Doctor / HealthWorker can add
router.post("/:patientId", authMiddleware, addCheckup);


// ================= GET ALL CHECKUPS OF PATIENT =================
// Used in Patient Dashboard + History
router.get("/:patientId", authMiddleware, getPatientCheckups);


// ================= GET SINGLE CHECKUP =================
router.get("/single/:id", authMiddleware, getSingleCheckup);


// ================= UPDATE CHECKUP =================
router.put("/:id", authMiddleware, updateCheckup);


// ================= DELETE CHECKUP =================
router.delete("/:id", authMiddleware, deleteCheckup);


export default router;