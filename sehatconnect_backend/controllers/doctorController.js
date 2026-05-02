import Doctor from "../models/Doctor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import { sendCredentialsMail } from "../utils/sendMail.js";



/* =========================================================
   DOCTOR REGISTRATION
========================================================= */
export const registerDoctor = async (req, res) => {
  try {
    console.log("\n================ REGISTER DOCTOR ================\n");

    const {
      fullName,
      email,
      phone,
      gender,
      dateOfBirth,
      specialization,
      qualification,
      experience,
      licenseNumber,
      medicalCouncil,
      password,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !phone ||
      !dateOfBirth ||
      !specialization ||
      !qualification ||
      !licenseNumber ||
      !medicalCouncil ||
      !password
    ) {
      return res.status(400).json({
        message: "All required fields must be filled",
      });
    }

    const existingDoctor = await Doctor.findOne({
      $or: [
        { email: email.toLowerCase() },
        { licenseNumber: licenseNumber.toUpperCase() },
      ],
    });

    if (existingDoctor) {
      return res.status(400).json({
        message: "Doctor already exists with email or license",
      });
    }

    /* ================= CLOUDINARY ================= */
    let photoUrl = "";

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

      photoUrl = uploadResult.secure_url;
    }

   /* ================= CREATE ================= */
const doctor = await Doctor.create({
  fullName,
  email: email.toLowerCase(),
  phone,
  gender,
  dateOfBirth,
  specialization,
  qualification:
    typeof qualification === "string"
      ? JSON.parse(qualification)
      : qualification,
  experience,
  licenseNumber,
  medicalCouncil,
  password, // raw password (hashed in model)
  photo: photoUrl,
});

console.log("📩 Doctor created successfully");
console.log("📩 About to send email...");

/* ================= EMAIL (NON-BLOCKING SAFE) ================= */
sendCredentialsMail({
  to: doctor.email,
  fullName: doctor.fullName,
  role: "Doctor",
  email: doctor.email,
  password,
})
  .then(() => {
    console.log("📩 Email sent successfully");
  })
  .catch((err) => {
    console.log("⚠️ Email failed (non-blocking):", err.message);
  });

/* ================= RESPONSE ================= */
return res.status(201).json({
  message: "Doctor registered successfully ✅",
  doctor,
});
 } catch (error) {
    console.error("❌ REGISTER ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};


/* =========================================================
   DOCTOR LOGIN
========================================================= */
export const doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const isMatch = await bcrypt.compare(
      password.trim(),
      doctor.password
    );

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: doctor._id, role: "doctor" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Doctor login successful ✅",
      token,
      doctor,
    });

  } catch (error) {
    console.error("❌ LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================================================
   PROFILE
========================================================= */
export const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ doctor });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================================================
   UPDATE PROFILE
========================================================= */
export const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id).select("+password");

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const { fullName, phone, password } = req.body;

    if (fullName) doctor.fullName = fullName;
    if (phone) doctor.phone = phone;

    // ✅ IMPORTANT FIX (NO MANUAL HASHING)
    if (password && password.trim() !== "") {
      doctor.password = password; // model will hash
    }

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
    }

    await doctor.save();

    res.json({ doctor });

  } catch (error) {
    console.error("❌ UPDATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================================================
   SEND CREDENTIALS
========================================================= */
export const sendDoctorCredentials = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    await sendCredentialsMail({
      to: doctor.email,
      fullName: doctor.fullName,
      role: "Doctor",
      email: doctor.email,
      password: "Use your existing password",
    });

    res.json({ message: "Sent" });

  } catch (error) {
    console.error("❌ SEND MAIL ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};