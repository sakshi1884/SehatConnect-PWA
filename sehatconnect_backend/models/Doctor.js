import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const doctorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      set: (value) => {
        const name = value
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        return name.startsWith("Dr.") ? name : `Dr. ${name}`;
      },
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      match: [/^[789]\d{9}$/, "Invalid Indian phone number"],
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    photo: {
      type: String,
      default: "",
    },

    specialization: {
      type: String,
      required: true,
      set: (v) =>
        v
          .toLowerCase()
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" "),
    },

    qualification: {
      type: [String],
      required: true,
    },

    experience: {
      type: Number,
      min: [0, "Experience cannot be negative"],
    },

    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },

    medicalCouncil: {
      type: String,
      required: true,
    },

    // 🔐 PASSWORD FIELD
    password: {
      type: String,
      required: true,
      select: false, // do not return by default
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/* =========================================================
   🔐 HASH PASSWORD (ONLY HERE — SINGLE SOURCE OF TRUTH)
========================================================= */
doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

/* =========================================================
   🔐 PASSWORD MATCH METHOD (CLEAN USAGE)
========================================================= */
doctorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Doctor", doctorSchema);