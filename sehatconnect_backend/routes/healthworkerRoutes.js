import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import bcrypt from "bcryptjs";
import upload from "../middleware/upload.js";

import {
  registerHealthworker,
  getAllHealthworkers,
  hwLogin,
  sendHWCredentials,
} from "../controllers/healthworkerController.js";

import HealthWorker from "../models/Healthworker.js";

const router = express.Router();

/* ---------------- REGISTER ---------------- */
router.post("/register", upload.single("photo"), registerHealthworker);

/* ---------------- LOGIN ---------------- */
router.post("/login", hwLogin);

/* ---------------- COUNT ---------------- */
router.get("/count", async (req, res) => {
  try {
    const count = await HealthWorker.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- GET ALL ---------------- */
router.get("/", getAllHealthworkers);

/* ---------------- DELETE ---------------- */
router.delete("/:id", async (req, res) => {
  try {
    await HealthWorker.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- SEND CREDENTIALS ---------------- */
router.post("/send-credentials/:id", sendHWCredentials);

/* =======================================================
   🔐 PROTECTED ROUTES (PROFILE + PASSWORD)
======================================================= */

/* ---------------- GET PROFILE ---------------- */
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "healthworker") {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- UPDATE PROFILE ---------------- */
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "healthworker") {
      return res.status(403).json({ message: "Access denied" });
    }

    const updated = await HealthWorker.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true }
    ).select("-password");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- CHANGE PASSWORD ---------------- */
router.put("/change-password", authMiddleware, async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Both password fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const worker = await HealthWorker.findById(req.user._id);

    if (!worker) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 IMPORTANT: assign directly (let schema handle hashing)
    worker.password = newPassword;

    await worker.save(); // triggers pre-save hashing

    return res.json({
      message: "Password updated successfully",
    });

  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;