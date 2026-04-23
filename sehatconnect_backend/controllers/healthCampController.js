import HealthCamp from "../models/HealthCamp.js";
import Doctor from "../models/Doctor.js";
import HealthWorker from "../models/Healthworker.js";
import Patient from "../models/Patient.js";
import { sendCampReminderMail } from "../utils/sendCampReminderMail.js";
import { sendCampNotificationMail } from "../utils/sendCampMail.js";

/* =========================
   GET ALL HEALTH CAMPS
   ========================= */
export const getAllHealthCamps = async (req, res) => {
  try {
    const camps = await HealthCamp.find().sort({ date: 1 });
    res.status(200).json(camps);
  } catch (err) {
    console.error("GET HEALTH CAMPS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   CREATE HEALTH CAMP + SEND MAIL
   ========================= */
export const createHealthCamp = async (req, res) => {
  try {
    const { name, date, time, location, description } = req.body;

    if (!name || !date || !time || !location || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Create camp
    const newCamp = await HealthCamp.create({
      name,
      date,
      time,
      location,
      description,
    });

    // ✅ Fetch all doctors & healthworkers
    const doctors = await Doctor.find().select("email fullName");
    const healthworkers = await HealthWorker.find().select("email fullName");
    const patients = await Patient.find().select("email fullName");
    const allUsers = [...doctors, ...healthworkers, ...patients];

    // ✅ Send emails (non-blocking safe loop)
    for (const user of allUsers) {
      try {
        await sendCampNotificationMail({
          to: user.email,
          campName: name,
          date,
          time,
          location,
          description,
        });
      } catch (mailErr) {
        console.log("MAIL FAILED:", user.email);
        console.log("ERROR:", mailErr.message);
      }
    }

    res.status(201).json(newCamp);
  } catch (err) {
    console.error("CREATE HEALTH CAMP ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   UPDATE HEALTH CAMP
   ========================= */
export const updateHealthCamp = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCamp = await HealthCamp.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedCamp);
  } catch (err) {
    console.error("UPDATE HEALTH CAMP ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   DELETE HEALTH CAMP
   ========================= */
export const deleteHealthCamp = async (req, res) => {
  try {
    const { id } = req.params;

    await HealthCamp.findByIdAndDelete(id);

    res.status(200).json({
      message: "Health camp deleted successfully",
    });
  } catch (err) {
    console.error("DELETE HEALTH CAMP ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
/* =========================
  REMINDER HEALTH CAMP
   ========================= */
   export const sendCampReminder = async (req, res) => {
  try {
    const { id } = req.params;

    const camp = await HealthCamp.findById(id);
    if (!camp) {
      return res.status(404).json({ message: "Camp not found" });
    }

    const healthworkers = await HealthWorker.find().select("email fullName");

    const campDate = new Date(camp.date);
    const today = new Date();

    const diffTime = campDate - today;
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    for (const hw of healthworkers) {
      try {
        await sendCampReminderMail({
          to: hw.email,
          fullName: hw.fullName,
          campName: camp.name,
          daysLeft,
          date: camp.date,
          time: camp.time,
          location: camp.location,
        });
      } catch (err) {
        console.log("REMINDER FAILED:", hw.email);
        console.log("ERROR:", err.message);
      }
    }

    res.status(200).json({
      message: "Reminder sent successfully ✅",
    });
  } catch (err) {
    console.error("REMINDER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};