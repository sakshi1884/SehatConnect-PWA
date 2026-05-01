import Patient from "../models/Patient.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { sendCredentialsMail } from "../utils/sendMail.js";

// ================= REGISTER =================
export const registerPatient = async (req, res) => {
  try {
    console.log("REGISTER API HIT");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("LOGGED IN HW:", req.user);

    const { fullName, email, phone, password } = req.body;

    // ✅ validation
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const existingPatient = await Patient.findOne({
      email: email.toLowerCase(),
    });

    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: "Patient already exists",
      });
    }

    let photoUrl = "";

    // ✅ cloudinary upload
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "sehatconnect/patients" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      photoUrl = uploadResult.secure_url;
    }

    const patient = await Patient.create({
      fullName,
      email: email.toLowerCase(),
      phone,
      password,
      profilePhoto: photoUrl,
      addedBy: req.user._id,
    });
     await sendCredentialsMail({
          to: patient.email,
          fullName: patient.fullName,
          role: "Patient",
          email: patient.email,
          password,
        });

    res.status(201).json({
      success: true,
      message: "Patient registered successfully ✅",
      patient,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= LOGIN =================
export const patientLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const patient = await Patient.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!patient) {
      return res.status(400).json({
        success: false,
        message: "Patient not found",
      });
    }

    const isMatch = await patient.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: patient._id,
        role: "patient",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      token,
      patient,
    });
  } catch (error) {
    console.error("PATIENT LOGIN ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ALL =================
export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate("addedBy", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error) {
    console.error("GET ALL PATIENTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET MY PATIENTS =================
export const getPatientsByHW = async (req, res) => {
  try {
    const patients = await Patient.find({
      addedBy: req.user._id,
    })
      .populate("addedBy", "fullName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error) {
    console.error("GET MY PATIENTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DELETE =================
export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // ✅ only owner HW can delete
    if (patient.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this patient",
      });
    }

    await Patient.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Patient deleted successfully ✅",
    });
  } catch (error) {
    console.error("DELETE PATIENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE PROFILE =================
export const updatePatientProfile = async (req, res) => {
  try {
    console.log("REQ.USER:", req.user);

    const patientId = req.user._id; // ✅ FIXED

    // ✅ validate ObjectId
    if (!patientId || !mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID",
      });
    }

    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const {
      fullName,
      email,
      password,
      dietType,
      maritalStatus,
      smokingStatus,
    } = req.body;

    // ================= SAFE UPDATE =================

    if (fullName && fullName !== "") {
      patient.fullName = fullName;
    }

    if (email && email !== "") {
      patient.email = email.toLowerCase();
    }

    if (dietType && dietType !== "") {
      patient.dietType = dietType;
    }

    if (maritalStatus && maritalStatus !== "") {
      patient.maritalStatus = maritalStatus;
    }

    if (smokingStatus && smokingStatus !== "") {
      patient.smokingStatus = smokingStatus;
    }

    // ================= PASSWORD =================
    if (password && password !== "") {
      patient.password = password;
    }

    // ================= PHOTO =================
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "sehatconnect/patients" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      patient.profilePhoto = uploadResult.secure_url;
    }

    await patient.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully ✅",
      patient,
    });

  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};