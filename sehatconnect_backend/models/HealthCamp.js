import mongoose from "mongoose";

const healthCampSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: String }, 
  },
  { timestamps: true }
);

const HealthCamp = mongoose.model("HealthCamp", healthCampSchema);
export default HealthCamp;
