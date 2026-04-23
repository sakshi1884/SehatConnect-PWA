import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const toPascalCase = (str) => {
  if (!str) return str;
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const patientSchema = new mongoose.Schema(
  {
    // ================= BASIC REQUIRED DETAILS =================
    fullName: {
      type: String,
      required: [true, "Full Name is required"],
      trim: true,
      set: toPascalCase,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[6-9]\d{9}$/, "Enter valid Indian mobile number"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      match: [
        /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must contain 1 uppercase, 1 number & 1 special character",
      ],
      select: false,
    },

    profilePhoto: {
      type: String,
      default: "",
    },

    // ================= AUTO HEALTHWORKER LINK =================
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HealthWorker",
      required: true,
    },

    // ================= OPTIONAL PERSONAL DETAILS =================
    dob: Date,

    age: Number,

    gender: {
      type: String,
      enum: ["Female", "Male", "Other",""],
    },

    address: String,
    region: String,
    village: String,

    contactNumber: String,

    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Widowed",""],
    },

    occupation: String,
    educationLevel: String,

    // ================= MEDICAL DETAILS =================
    pastMedicalConditions: String,
    pastSurgeries: String,
    longTermMedications: String,
    allergies: String,
    familyHistory: String,
    lifestyleBasics: String,

    smokingStatus: {
      type: String,
      enum: ["Never", "Former", "Current",""],
    },

    alcoholConsumption: String,

    dietType: {
      type: String,
      enum: ["Veg", "Non-Veg", "Mixed",""],
    },

    // ================= PROFILE STATUS =================
    profileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* HASH PASSWORD */
patientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* PASSWORD MATCH METHOD */
patientSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Patient", patientSchema);