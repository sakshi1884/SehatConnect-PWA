// models/HealthCamp.js
const mongoose = require("mongoose");

const HealthCampSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: {
    name: String,
    address: String,
    region: String
  },
  startDate: Date,
  endDate: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  visible: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("HealthCamp", HealthCampSchema);
