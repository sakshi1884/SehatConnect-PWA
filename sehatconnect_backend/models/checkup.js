import mongoose from "mongoose";

const checkupSchema = new mongoose.Schema(
  {
    // ================= RELATIONS =================
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "createdByModel",
    },

    createdByModel: {
      type: String,
      required: true,
      enum: ["Doctor", "HealthWorker"],
    },

    name: String, // Doctor / HW name

    // ================= BASIC =================
    date: {
      type: Date,
      default: Date.now,
    },

    // ================= VITALS =================
    temperature: Number,
    heartRate: Number,
    respiratoryRate: Number,
    spo2: Number,

    systolic: Number,
    diastolic: Number,

    // ================= BODY =================
    weight: Number,
    height: Number,
    bmi: Number,

    // ================= DERIVED =================
    pulsePressure: Number, // systolic - diastolic
    map: Number,           // mean arterial pressure
    hrv: Number,           // optional (placeholder for now)

    // ================= EXTRA =================
    remarks: String,

    // ================= AI OUTPUT =================
    riskLevel: String,     // Low / Moderate / High
  },
  { timestamps: true }
);

export default mongoose.model("Checkup", checkupSchema);