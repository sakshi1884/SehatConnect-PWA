const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dob: { type: Date },
  age: { type: Number },
  gender: { type: String, enum: ['Male','Female','Other'] },
  address: {
    region: String,
    village: String,
    full: String
  },
   email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  mobileNo: { type: String },
  maritalStatus: { type: String },
  occupation: String,
  educationLevel: String,
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'HealthWorker', required: true },
  pastMedicalConditions: [String],   
  pastSurgeries: [String],
  longTermMedications: [String],
  allergies: [String],
  familyHistory: [String],          
  lifestyleBasics: { type: Map, of: String }, 
  smokingStatus: { type: String, enum:['Never','Former','Current'] },
  alcoholConsumption: {
    yesNo: { type: Boolean, default: false },
    frequency: String
  },
  dietType: { type: String, enum:['Veg','Non-Veg','Mixed'] }
}, { timestamps: true });

module.exports = mongoose.model("Patient", PatientSchema);
