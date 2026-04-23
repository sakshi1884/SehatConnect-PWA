import cloudinary from "../config/cloudinary.js";
import Doctor from "../models/Doctor.js";
import Healthworker from "../models/Healthworker.js";
import Patient from "../models/Patient.js";

// Upload Doctor Photo
export const uploadDoctorPhoto = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "sehatconnect/doctors",
    });

    // Update doctor profile with URL
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    doctor.photo = result.secure_url;
    await doctor.save();

    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Upload Healthworker Photo
export const uploadHealthworkerPhoto = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "sehatconnect/healthworkers",
    });

    const hw = await Healthworker.findById(req.params.id);
    if (!hw) return res.status(404).json({ message: "Healthworker not found" });

    hw.profilePhoto = result.secure_url;
    await hw.save();

    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Upload Patient Photo
export const uploadPatientPhoto = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "sehatconnect/patients",
    });

    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    patient.profilePhoto = result.secure_url;
    await patient.save();

    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
