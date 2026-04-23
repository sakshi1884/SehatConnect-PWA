// models/Checkup.js
const mongoose = require("mongoose");

const CheckupSchema = new mongoose.Schema({
  visitId: { type: String, required: true, unique: true }, // auto-generated UUID
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  dateOfVisit: { type: Date, required: true },
  heightCm: Number,
  weightKg: Number,
  bmi: Number,                         // auto-calculated
  bpSystolic: Number,
  bpDiastolic: Number,
  heartRate: Number,
  respiratoryRate: Number,
  temperatureC: Number,
  bloodSugarFasting: Number,
  bloodSugarRandom: Number,
  cholesterolLevel: Number,
  spo2: Number,
  symptomsReported: String,
  diagnosis: String,
  prescriptions: [String],
  remarks: String,
  editedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  editedAt: Date,
  editHistory: [
    {
      editedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      editedAt: Date,
      changes: mongoose.Schema.Types.Mixed
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Checkup", CheckupSchema);
