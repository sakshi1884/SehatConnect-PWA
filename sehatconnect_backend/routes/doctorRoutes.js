import express from "express";
import upload from "../middleware/upload.js";
import {
  registerDoctor,
  doctorLogin,
  sendDoctorCredentials,
} from "../controllers/doctorController.js";
import Doctor from "../models/Doctor.js";
import authMiddleware from "../middleware/authMiddleware.js";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const router = express.Router();

/* ================= AUTH ================= */
router.post("/register", upload.single("photo"), registerDoctor);

router.post(
  "/login",
  (req, res, next) => {
    console.log("DOCTOR LOGIN ROUTE HIT");
    next();
  },
  doctorLogin
);

/* ================= PROFILE ================= */
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user._id).select("-password");

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({ doctor });
  } catch (err) {
    console.error("PROFILE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ================= PROFILE UPDATE (FIXED - CLOUDINARY ONLY) ================= */
router.put(
  "/profile",
  authMiddleware,
  upload.single("photo"),
  async (req, res) => {
    try {
      console.log("FILE RECEIVED:", req.file);

      const doctor = await Doctor.findById(req.user._id);

      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      // ================= BASIC FIELDS =================
      if (req.body.fullName) doctor.fullName = req.body.fullName;
      if (req.body.phone) doctor.phone = req.body.phone;

      // ================= CLOUDINARY IMAGE FIX =================
      if (req.file) {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "sehatconnect/doctors" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

        doctor.photo = uploadResult.secure_url;

        console.log("NEW CLOUDINARY PHOTO:", doctor.photo);
      }

      // ================= PASSWORD UPDATE =================
      if (req.body.password) {
  doctor.password = req.body.password; // let pre-save handle hashing
}

      await doctor.save();

      res.json({
        message: "Profile updated successfully",
        doctor,
      });
    } catch (err) {
      console.error("PROFILE UPDATE ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

/* ================= OTHER ROUTES ================= */
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/send-credentials/:id", sendDoctorCredentials);

router.get("/count", async (req, res) => {
  try {
    const count = await Doctor.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: "Doctor deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;