import HealthWorker from "../models/Healthworker.js";
import cloudinary from "../config/cloudinary.js";
import jwt from "jsonwebtoken";
import { sendCredentialsMail } from "../utils/sendMail.js";

/* =========================
   REGISTER HEALTH WORKER
   ========================= */
export const registerHealthworker = async (req, res) => {
  try {
    console.log("ENTER registerHealthworker:", req.body);

    const { fullName, email, phone, role, domicileCity, password } = req.body;

    if (!fullName || !email || !phone || !role || !domicileCity || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingHW = await HealthWorker.findOne({
      email: email.toLowerCase(),
    });

    if (existingHW) {
      return res.status(400).json({
        message: "Healthworker already exists",
      });
    }

    // Upload image
    let profilePhoto = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        { folder: "sehatconnect/healthworkers" }
      );
      profilePhoto = result.secure_url;
    }

    // ✅ IMPORTANT: NO HASHING HERE (handled by schema pre-save)
    const hw = await HealthWorker.create({
      fullName,
      email: email.toLowerCase(),
      phone,
      role,
      domicileCity,
      password,
      profilePhoto,
    });

    // send credentials mail
    await sendCredentialsMail({
      to: hw.email,
      fullName: hw.fullName,
      role: "Health Worker",
      email: hw.email,
      password, // plain password only for email
    });

    const { password: pwd, ...safeHW } = hw._doc;

    return res.status(201).json({
      message: "Healthworker registered successfully ✅",
      hw: {
        ...safeHW,
        profilePic: safeHW.profilePhoto || "",
      },
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   LOGIN HEALTH WORKER
   ========================= */
export const hwLogin = async (req, res) => {
  try {
    console.log("🔥 HEALTHWORKER LOGIN HIT");

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const hw = await HealthWorker.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!hw) {
      console.log("❌ USER NOT FOUND");
      return res.status(404).json({
        message: "Healthworker not found",
      });
    }

    console.log("DB PASSWORD EXISTS ✔");

    const isMatch = await hw.matchPassword(password);

    console.log("PASSWORD MATCH RESULT:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { id: hw._id, role: "healthworker" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const { password: pwd, ...safeHW } = hw._doc;

    return res.status(200).json({
      message: "Healthworker login successful ✅",
      token,
      role: "healthworker",
      hw: {
        ...safeHW,
        profilePic: safeHW.profilePhoto || "",
      },
    });

  } catch (err) {
    console.error("HW LOGIN ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   SEND CREDENTIALS
   ========================= */
export const sendHWCredentials = async (req, res) => {
  try {
    const { id } = req.params;

    const hw = await HealthWorker.findById(id);

    if (!hw) {
      return res.status(404).json({
        message: "Healthworker not found",
      });
    }

    await sendCredentialsMail({
      to: hw.email,
      fullName: hw.fullName,
      role: "Health Worker",
      email: hw.email,
      password: "Use your existing password",
    });

    return res.status(200).json({
      message: "Credentials email sent successfully ✅",
    });

  } catch (error) {
    console.error("SEND HW CREDENTIALS ERROR:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================
   GET ALL HEALTHWORKERS
   ========================= */
export const getAllHealthworkers = async (req, res) => {
  try {
    const healthworkers = await HealthWorker.find().select(
      "fullName email phone role domicileCity profilePhoto createdAt"
    );

    const formattedHW = healthworkers.map((hw) => ({
      ...hw._doc,
      profilePic: hw.profilePhoto || "",
    }));

    res.status(200).json(formattedHW);

  } catch (err) {
    console.error("GET ALL HEALTHWORKERS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   DELETE HEALTHWORKER
   ========================= */
export const deleteHealthworker = async (req, res) => {
  try {
    const { id } = req.params;

    const hw = await HealthWorker.findById(id);

    if (!hw) {
      return res.status(404).json({
        message: "Healthworker not found",
      });
    }

    await HealthWorker.findByIdAndDelete(id);

    res.status(200).json({
      message: "Healthworker deleted successfully",
    });

  } catch (err) {
    console.error("DELETE HEALTHWORKER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};